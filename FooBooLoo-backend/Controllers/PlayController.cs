using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FooBooLoo_backend.Models;

[ApiController]
[Route("api/play")]
public class PlayController : ControllerBase
{
    private static readonly Dictionary<string, HashSet<int>> _sessionNumbers = new();
    private readonly GameService _gameService;

    public PlayController(GameService gameService)
    {
        _gameService = gameService;
    }

    [HttpGet("{gameId}/start")]
    public async Task<IActionResult> StartGame(int gameId)
    {
        var selectedGame = await _gameService.GetGameByIdAsync(gameId);
        if (selectedGame == null) return NotFound("Game not found");

        string sessionId = Guid.NewGuid().ToString();
        _sessionNumbers[sessionId] = new HashSet<int> { gameId };

        return Ok(new { sessionId, gameRules = selectedGame.Rules });
    }

    [HttpGet("{sessionId}/next")]
    public IActionResult GetNextNumber(string sessionId)
    {
        if (!_sessionNumbers.ContainsKey(sessionId))
            return NotFound("Session not found");

        int gameId = _sessionNumbers[sessionId].FirstOrDefault();
        if (gameId == 0) return NotFound("Game not found in session");

        var game = _gameService.GetAllGamesAsync().Result.FirstOrDefault(g => g.Id == gameId);
        if (game == null) return NotFound("Game not found");

        Random random = new();
        int number;
        int divisibilityCount;

        do
        {
            number = random.Next(1, 1000);

            // Count how many rules this number is divisible by
            divisibilityCount = game.Rules.Count(r => r.Divisor != 0 && number % r.Divisor == 0);

        } while (_sessionNumbers[sessionId].Contains(number) || divisibilityCount != 1); // Ensure divisibility by exactly one rule

        _sessionNumbers[sessionId].Add(number);
        return Ok(new { number });
    }


    [HttpPost("{sessionId}/answer")]
    public async Task<IActionResult> VerifyAnswer(string sessionId, [FromBody] AnswerRequest request)
    {
        if (!_sessionNumbers.ContainsKey(sessionId))
            return NotFound("Session not found");

        var selectedGame = await _gameService.GetGameByIdAsync(request.GameId);
        if (selectedGame == null) return NotFound("Game not found");

        string correctAnswer = ComputeFizzBuzz(request.Number, selectedGame.Rules);
        bool isCorrect = correctAnswer == request.Answer;

        return Ok(new { isCorrect, correctAnswer });
    }

    private bool IsDivisibleByAtLeastOneRule(int number, List<Rule> rules)
    {
        return rules.Any(r => r.Divisor != 0 && number % r.Divisor == 0);
    }

    private static string ComputeFizzBuzz(int number, List<Rule> rules)
    {
        var applicableRule = rules.FirstOrDefault(r => number % r.Divisor == 0);
        return applicableRule != null ? applicableRule.Replacement : number.ToString();
    }
}
