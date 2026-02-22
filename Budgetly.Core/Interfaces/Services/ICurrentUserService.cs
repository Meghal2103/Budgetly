namespace Budgetly.Core.Interfaces.Services
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
        string? Email { get; }
        string[] Roles { get; }
        bool IsAuthenticated { get; }
    }
}
