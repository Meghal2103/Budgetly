namespace Budgetly.Core.Models
{
    public class CurrentUser
    {
        public int? UserId { get; set; }
        public string? Email { get; set; }
        public string[] Roles { get; set; } = Array.Empty<string>();
        public bool IsAuthenticated { get; set; }
    }
}
