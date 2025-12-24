using AutoMapper;
using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Budgetly.Core.Interfaces.Services;
using Budgetly.Core.ViewModel;

namespace Budgetly.Application.Services
{
    internal class TransactionService(ITransactionRepository transactionRepository, IMapper mapper) : ITransactionService
    {
        public async Task<TransactionViewModel> AddTransaction(AddEditTransaction addEditTransaction)
        {
            var transaction = mapper.Map<Transaction>(addEditTransaction);
            await transactionRepository.AddTransactionAsync(transaction);
            return mapper.Map<TransactionViewModel>(transaction);
        }
      
        public async Task<List<TransactionType>> GetTransactionType()
        {
            return await transactionRepository.GetTransactionType();
        }

        public async Task<List<Category>> GetCategories()
        {
            return await transactionRepository.GetCategories();
        }

        public async Task<List<TransactionViewModel>> GetTransactions()
        {
            var transactions =  mapper.Map<List<TransactionViewModel>>(await transactionRepository.GetTransactions());

            return transactions;
        }
    }
}
