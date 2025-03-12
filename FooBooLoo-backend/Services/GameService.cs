using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class GameService
{
    private readonly GameDbContext _context;

    public GameService(GameDbContext context)
    {
        _context = context;
    }

    public async Task<Game> CreateGameAsync(string name, string author, List<Rule> rules)
    {
        var game = new Game { Name = name, Author = author, Rules = rules };
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return game;
    }

    public async Task<List<Game>> GetAllGamesAsync()
    {
        return await _context.Games.Include(g => g.Rules).ToListAsync();
    }

    public async Task<Game> GetGameByIdAsync(int gameId)
    {
        var game = await _context.Games.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == gameId);
        if (game == null)
        {
            throw new KeyNotFoundException($"Game with ID {gameId} not found.");
        }
        return game;
    }

    public async Task DeleteGameAsync(int gameId)
    {
        var game = await _context.Games.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == gameId);
        if (game != null)
        {
            _context.Games.Remove(game);
            await _context.SaveChangesAsync();
        }
    }
}
