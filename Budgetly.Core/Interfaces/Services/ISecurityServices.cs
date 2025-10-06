using Budgetly.Core.Entities;

namespace Budgetly.Core.Interfaces.Services
{
    public interface ISecurityServices
    {
        string HashPassword(string password, string salt);
        string GenerateToken(Guid userId, User user);
    }
}
