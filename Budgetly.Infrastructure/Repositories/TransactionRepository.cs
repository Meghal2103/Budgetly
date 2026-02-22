using Budgetly.Core.DTOs.Transaction;
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

        public async Task<(int count, List<Transaction>)> RequestTransactions(TransactionsRequestDTO transactionsRequestDTO)
        {
            var query = dbContext.Transactions.Where(t => t.UserId == transactionsRequestDTO.UserId)
            .AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(transactionsRequestDTO.SearchText))
            {
                var searchText = transactionsRequestDTO.SearchText.Trim();
                query = query.Where(t =>
                    t.Title.Contains(searchText) ||
                    t.Notes.Contains(searchText));
            }

            if (transactionsRequestDTO.CategoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == transactionsRequestDTO.CategoryId.Value);
            }

            if (transactionsRequestDTO.TransactionTypeID.HasValue)
            {
                query = query.Where(t => t.TransactionTypeID == transactionsRequestDTO.TransactionTypeID.Value);
            }

            if (transactionsRequestDTO.StartDate.HasValue)
            {
                query = query.Where(t => t.DateTime >= transactionsRequestDTO.StartDate.Value);
            }

            if (transactionsRequestDTO.EndDate.HasValue)
            {
                var endDateInclusive = transactionsRequestDTO.EndDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(t => t.DateTime <= endDateInclusive);
            }

            var totalCount = await query.CountAsync();

            var pageSize = transactionsRequestDTO.PageSize.GetValueOrDefault();
            var pageNumber = transactionsRequestDTO.PageNumber.GetValueOrDefault(1);

            if (pageSize > 0)
            {
                var skip = Math.Max(pageNumber, 1) - 1;
                query = query
                    .OrderByDescending(t => t.DateTime)
                    .Skip(skip * pageSize)
                    .Take(pageSize);
            }
            else
            {
                query = query.OrderByDescending(t => t.DateTime);
            }

            var transactions = await query.ToListAsync();
            return (totalCount, transactions);
        }
    }
}
