using Budgetly.Core.Entities;

namespace Budgetly.Core.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
