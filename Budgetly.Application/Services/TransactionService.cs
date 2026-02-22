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

        public async Task<TransactionsDTO> GetTransactions()
        {
            TransactionsDTO transactionsDTO = new();
            var (count, transactions) = await transactionRepository.GetTransactions();
            transactionsDTO.TotalCount = count;
            transactionsDTO.Transactions =  mapper.Map<List<TransactionViewModel>>(transactions);
            transactionsDTO.PageSize = count;
            transactionsDTO.CurrentPage = 1;

            return transactionsDTO;
        }

        public async Task<TransactionsDTO> RequestTransactions(TransactionsRequestDTO transactionsRequestDTO)
        {
            TransactionsDTO transactionsDTO = new();
            var (count, transactions) = await transactionRepository.RequestTransactions(transactionsRequestDTO);

            var pageSize = transactionsRequestDTO.PageSize.GetValueOrDefault(count);
            var pageNumber = transactionsRequestDTO.PageNumber.GetValueOrDefault(1);

            transactionsDTO.TotalCount = count;
            transactionsDTO.Transactions = mapper.Map<List<TransactionViewModel>>(transactions);
            transactionsDTO.PageSize = pageSize == 0 ? count : pageSize;
            transactionsDTO.CurrentPage = pageNumber;

            return transactionsDTO;
        }
    }
}
