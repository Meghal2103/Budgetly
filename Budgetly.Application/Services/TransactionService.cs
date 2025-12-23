using AutoMapper;
using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Budgetly.Core.Interfaces.Services;

namespace Budgetly.Application.Services
{
    internal class TransactionService(ITransactionRepository transactionRepository, IMapper mapper) : ITransactionService
    {
        public async Task<TransactionDTO> AddTransaction(AddEditTransaction addEditTransaction)
        {
            var transaction = mapper.Map<Transaction>(addEditTransaction);
            await transactionRepository.AddTransactionAsync(transaction);
            return mapper.Map<TransactionDTO>(transaction);
        }
      
        public async Task<List<TransactionType>> GetTransactionType()
        {
            return await transactionRepository.GetTransactionType();
        }

        public async Task<List<Category>> GetCategories()
        {
            return await transactionRepository.GetCategories();
        }

        public async Task<List<TransactionDTO>> GetTransactions()
        {
            var transactions =  mapper.Map<List<TransactionDTO>>(await transactionRepository.GetTransactions());

            return transactions;
        }
    }
}
