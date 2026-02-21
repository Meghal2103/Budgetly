using Budgetly.Core.Entities;

namespace Budgetly.Core.Interfaces.Repository
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByTransactionAsync(int TransactionId);
        Task<Transaction> AddTransactionAsync(Transaction user);
        public Task<List<TransactionType>> GetTransactionType();
        public Task<List<Category>> GetCategories();
        public Task<(int count, List<Transaction>)> GetTransactions();
    }
}
