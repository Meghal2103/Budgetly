using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;

namespace Budgetly.Core.Interfaces.Services
{
    public interface ITransactionService
    {
        Task<TransactionDTO> AddTransaction(AddEditTransaction addEditTransaction);
        Task<List<TransactionType>> GetTransactionType();
        Task<List<Category>> GetCategories();
        Task<List<TransactionDTO>> GetTransactions();
    }
}
