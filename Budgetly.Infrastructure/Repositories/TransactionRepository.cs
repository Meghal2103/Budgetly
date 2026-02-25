using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace Budgetly.Infrastructure.Repositories
{
    internal class TransactionRepository(AppDbContext dbContext, IUserRepository userRepository) : ITransactionRepository
    {
        public async Task<Transaction?> GetByTransactionAsync(int TransactionId)
        {
            return await dbContext.Transactions.FirstOrDefaultAsync(u => u.TransactionId == TransactionId);
        }

        public async Task<Transaction> AddTransactionAsync(Transaction transaction)
        {
            var user = await userRepository.GetUserByIDAsync(transaction.UserId);
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

        public async Task<(int, List<Transaction>)> GetTransactions(int userId)
        {
            return (await dbContext.Transactions.CountAsync(t => t.UserId == userId), await dbContext.Transactions.Where(t => t.UserId == userId).AsNoTracking().ToListAsync());
        }

        public async Task<(int count, decimal pageBalance, List<Transaction>)> RequestTransactions(TransactionsRequestDTO transactionsRequestDTO, int userId)
        {
            var searchText = transactionsRequestDTO.SearchText?.Trim();
            DateTime? startDate = transactionsRequestDTO.StartDate?.ToDateTime(TimeOnly.MinValue);
            DateTime? endDate = transactionsRequestDTO.EndDate?.ToDateTime(TimeOnly.MaxValue);

            var query = dbContext.Transactions.Where(t => t.UserId == userId 
                                    && (string.IsNullOrWhiteSpace(searchText) || t.Title.Contains(searchText) || t.Notes.Contains(searchText))
                                    && (!transactionsRequestDTO.CategoryId.HasValue || t.CategoryId == transactionsRequestDTO.CategoryId)
                                    && (!transactionsRequestDTO.TransactionTypeID.HasValue || t.TransactionTypeID == transactionsRequestDTO.TransactionTypeID)
                                    && (!startDate.HasValue || t.DateTime >= startDate)
                                    && (!endDate.HasValue || t.DateTime <= endDate))
                                    .AsNoTracking().AsQueryable();

            var totalCount = await query.CountAsync();
            var pageSize = transactionsRequestDTO.PageSize;
            var pageNumber = transactionsRequestDTO.PageNumber;

            query = query.OrderByDescending(t => t.DateTime)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize);

            var transactions = await query.ToListAsync();
            var pageBalance = transactions.Sum(t => t.Amount);

            return (totalCount, pageBalance, transactions);
        }
    }
}
