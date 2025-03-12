namespace FooBooLoo_backend.Models
{
    public class AnswerRequest
    {
        public int GameId { get; set; }
        public int Number { get; set; }
        public string Answer { get; set; } = string.Empty;
    }
}
