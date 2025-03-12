using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/games")]
public class GameController : ControllerBase
{
    private readonly GameService _gameService;

    public GameController(GameService gameService)
    {
        _gameService = gameService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateGame([FromBody] Game game)
    {
        var createdGame = await _gameService.CreateGameAsync(game.Name, game.Author, game.Rules);
        return CreatedAtAction(nameof(GetGames), new { id = createdGame.Id }, createdGame);
    }

    [HttpGet]
    public async Task<IActionResult> GetGames()
    {
        var games = await _gameService.GetAllGamesAsync();
        return Ok(games);
    }

    [HttpDelete("{gameId}")]
    public async Task<IActionResult> DeleteGame(int gameId)
    {
        var game = await _gameService.GetGameByIdAsync(gameId);
        if (game == null) return NotFound("Game not found");

        await _gameService.DeleteGameAsync(gameId);
        return NoContent();
    }
}
