using Microsoft.EntityFrameworkCore;

public class GameDbContext : DbContext
{
    public DbSet<Game> Games { get; set; }
    public DbSet<Rule> Rules { get; set; }

    public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }
}
