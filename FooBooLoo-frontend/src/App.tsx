import React, { useState, useEffect } from 'react';
import {
  fetchGames,
  createGame,
  startGame,
  getNextNumber,
  submitAnswer,
  deleteGame,
} from './api';

const App: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [number, setNumber] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [gameName, setGameName] = useState('');
  const [author, setAuthor] = useState('');
  const [rules, setRules] = useState<{ divisor: number; replacement: string }[]>([
    { divisor: 0, replacement: 'Foo' },
    { divisor: 0, replacement: 'Boo' },
    { divisor: 0, replacement: 'Loo' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
        setGames(data);
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const handleCreateGame = async () => {
    if (rules.some((rule) => rule.divisor === 0)) {
      setError('All rules must have a valid divisor.');
      return;
    }
    try {
      await createGame({ name: gameName, author, rules });
      setGameName('');
      setAuthor('');
      setRules([
        { divisor: 0, replacement: 'Foo' },
        { divisor: 0, replacement: 'Boo' },
        { divisor: 0, replacement: 'Loo' },
      ]);
      setError(null);
      const data = await fetchGames();
      setGames(data);
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const handleStartGame = async (gameId: number) => {
    try {
      const { sessionId } = await startGame(gameId);
      setSelectedGame(games.find((g) => g.id === gameId));
      setSessionId(sessionId);
      const { number } = await getNextNumber(sessionId);
      setNumber(number);
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleSubmitAnswer = async (selectedAnswer: string) => {
    if (!sessionId || !selectedGame || number === null) return;
    try {
      const { isCorrect } = await submitAnswer(sessionId, selectedGame.id, number, selectedAnswer);
      if (isCorrect) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
      const { number: nextNumber } = await getNextNumber(sessionId);
      setNumber(nextNumber);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleDeleteGame = async (gameId: number) => {
    try {
      await deleteGame(gameId);
      const data = await fetchGames();
      setGames(data);
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  };

  return (
    <div>
      <h1>FizzBuzz Game</h1>

      {/* Game Creation Section */}
      <div>
        <h2>Create a New Game</h2>
        <input
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <div>
          {rules.map((rule, index) => (
            <div key={index}>
              <input
                type="number"
                placeholder="Divisor"
                value={rule.divisor === 0 ? '' : rule.divisor}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[index].divisor = Number(e.target.value);
                  setRules(newRules);
                }}
              />
              <input
                placeholder="Replacement"
                value={rule.replacement}
                readOnly
              />
            </div>
          ))}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          onClick={handleCreateGame}
          disabled={rules.some((rule) => rule.divisor === 0)}
        >
          Create Game
        </button>
      </div>

      {/* Game Selection Section */}
      <div>
        <h2>Select a Game to Play</h2>
        {loading ? (
          <p>Loading games...</p>
        ) : (
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                <button onClick={() => handleStartGame(game.id)}>{game.name}</button>
                <button onClick={() => handleDeleteGame(game.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Game Play Section */}
      {selectedGame && (
        <div>
          <h2>Playing: {selectedGame.name}</h2>
          <p>Rules: {selectedGame.rules.map((rule: any) => `${rule.divisor}: ${rule.replacement}`).join(', ')}</p>
          {number && (
            <div>
              <p>Number: {number}</p>
              <div>
                <button onClick={() => handleSubmitAnswer('Foo')}>Foo</button>
                <button onClick={() => handleSubmitAnswer('Boo')}>Boo</button>
                <button onClick={() => handleSubmitAnswer('Loo')}>Loo</button>
              </div>
            </div>
          )}
          <p>Correct: {score.correct}</p>
          <p>Incorrect: {score.incorrect}</p>
        </div>
      )}
    </div>
  );
};

export default App;