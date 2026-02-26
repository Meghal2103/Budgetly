using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.ViewModel;

namespace Budgetly.Core.Interfaces.Repository
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByTransactionAsync(int TransactionId);
        Task<Transaction> AddTransactionAsync(Transaction user);
        Task<List<TransactionType>> GetTransactionType();
        Task<List<Category>> GetCategories();
        Task<(int count, List<Transaction>)> GetTransactions(int userId);
        Task<(int count, decimal pageBalance, List<Transaction>)> RequestTransactions(TransactionsRequestDTO transactionsRequestDTO, int userId);
        Task<Transaction?> GetTransactionsDetails(int UserId, int transactionID);
    }
}
