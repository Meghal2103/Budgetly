using Budgetly.Core.Entities;

namespace Budgetly.Core.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);

        Task<User> AddUserAsync(User user);
    }
}
