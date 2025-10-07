using Budgetly.Core.Entities;

namespace Budgetly.Application.Interfaces
{
    public interface ISecurityServices
    {
        string HashPassword(string password, string salt);
        string GenerateToken(User user);
        string GenerateSalt(int size = 32);
    }
}
