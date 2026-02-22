using Budgetly.Core.Entities;

namespace Budgetly.Core.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);

        Task<User?> GetUserByIDAsync(int UserId);

        Task<decimal> GetUserBalanceByIDAsync(int UserId);

        Task<User> AddUserAsync(User user);
    }
}
