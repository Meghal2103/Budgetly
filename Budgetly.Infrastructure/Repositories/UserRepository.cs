using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace Budgetly.Infrastructure.Repositories
{
    internal class UserRepository(AppDbContext dbContext) : IUserRepository
    {
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email); 
        }

        public async Task<User?> GetUserByIDAsync(int UserId)
        {
            return await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == UserId);
        }

        public async Task<decimal> GetUserBalanceByIDAsync(int UserId)
        {
            return await dbContext.Users.Where(u => u.UserId == UserId).Select(u => u.Balance).SingleAsync();
        }

        public async Task<User> AddUserAsync(User user)
        {
            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
            return user;
        }
    }
}
