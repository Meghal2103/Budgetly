using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace Budgetly.Infrastructure.Repositories
{
    internal class UserRepository(AppDbContext dbContext) : IUserRepository
    {
        public Task<User?> GetByEmailAsync(string email)
        {
            return dbContext.Users.FirstOrDefaultAsync(u => u.Email == email); 
        }
    }
}
