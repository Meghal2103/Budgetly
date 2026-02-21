using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace Budgetly.Infrastructure.Repositories
{
    internal class TransactionRepository(AppDbContext dbContext) : ITransactionRepository
    {
        public async Task<Transaction?> GetByTransactionAsync(int TransactionId)
        {
            return await dbContext.Transactions.FirstOrDefaultAsync(u => u.TransactionId == TransactionId);
        }

        public async Task<Transaction> AddTransactionAsync(Transaction transaction)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == transaction.UserId);
            user.Balance += transaction.Amount;
            await dbContext.Transactions.AddAsync(transaction);
            await dbContext.SaveChangesAsync();
            return transaction;
        }

        public async Task<List<TransactionType>> GetTransactionType()
        {
            return await dbContext.TransactionTypes.AsNoTracking().ToListAsync();
        }

        public async Task<List<Category>> GetCategories()
        {
            return await dbContext.Categories.AsNoTracking().ToListAsync();
        }

        public async Task<(int, List<Transaction>)> GetTransactions()
        {
            return (await dbContext.Transactions.CountAsync(), await dbContext.Transactions.AsNoTracking().ToListAsync());
        }
    }
}
