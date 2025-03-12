import axios from "axios";

// Check if the app is running in Docker
const isDocker = window.location.hostname === "localhost" ? false : true;

// Use the backend service name in Docker, otherwise use localhost for local development
const API_BASE_URL = isDocker ? "http://backend/api" : "http://localhost:7124/api";
console.log("API Base URL:", API_BASE_URL);


// Fetch all games
export const fetchGames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch games:", error);
    throw error;
  }
};

// Create a new game
export const createGame = async (game: { name: string; author: string; rules: any[] }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/games`, game);
    return response.data;
  } catch (error) {
    console.error("Failed to create game:", error);
    throw error;
  }
};

// Start a game session
export const startGame = async (gameId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/play/${gameId}/start`);
    return response.data;
  } catch (error) {
    console.error("Failed to start game:", error);
    throw error;
  }
};

// Get the next number in the game
export const getNextNumber = async (sessionId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/play/${sessionId}/next`);
    return response.data;
  } catch (error) {
    console.error("Failed to get next number:", error);
    throw error;
  }
};

// Submit an answer
export const submitAnswer = async (sessionId: string, gameId: number, number: number, answer: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/play/${sessionId}/answer`, {
      gameId,
      number,
      answer,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to submit answer:", error);
    throw error;
  }
};

// Delete a game
export const deleteGame = async (gameId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete game:", error);
    throw error;
  }
};
