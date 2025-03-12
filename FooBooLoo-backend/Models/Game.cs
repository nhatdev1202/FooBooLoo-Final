using System.Collections.Generic;

public class Game
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public List<Rule> Rules { get; set; } = new();
}
