using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.ViewModel;

namespace Budgetly.Core.Interfaces.Services
{
    public interface ITransactionService
    {
        Task<TransactionViewModel> AddTransaction(AddEditTransaction addEditTransaction);
        Task<List<TransactionType>> GetTransactionType();
        Task<List<Category>> GetCategories();
        Task<TransactionsDTO> GetTransactions();
        Task<TransactionsDTO> RequestTransactions(TransactionsRequestDTO transactionsRequestDTO);
    }
}
