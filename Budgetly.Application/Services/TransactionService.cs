using AutoMapper;
using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Budgetly.Core.Interfaces.Services;
using Budgetly.Core.ViewModel;

namespace Budgetly.Application.Services
{
    internal class TransactionService(ITransactionRepository transactionRepository, IMapper mapper, ICurrentUserService currentUserService, IUserRepository userRepository) : ITransactionService
    {
        public async Task<TransactionViewModel> AddTransaction(AddEditTransaction addEditTransaction)
        {
            var userId = currentUserService.UserId
                ?? throw new UnauthorizedAccessException("User not authenticated.");
            var transaction = mapper.Map<Transaction>(addEditTransaction);
            transaction.UserId = userId;
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
            var userId = currentUserService.UserId
                ?? throw new UnauthorizedAccessException("User not authenticated.");
            TransactionsDTO transactionsDTO = new();
            var (count, transactions) = await transactionRepository.GetTransactions(userId);
            transactionsDTO.TotalCount = count;
            transactionsDTO.Transactions =  mapper.Map<List<TransactionViewModel>>(transactions);
            transactionsDTO.PageSize = count;
            transactionsDTO.CurrentPage = 1;

            return transactionsDTO;
        }

        public async Task<TransactionsDTO> RequestTransactions(TransactionsRequestDTO transactionsRequestDTO)
        {
            var userId = currentUserService.UserId
                ?? throw new UnauthorizedAccessException("User not authenticated.");
            TransactionsDTO transactionsDTO = new();
            var (count, pageBalance, transactions) = await transactionRepository.RequestTransactions(transactionsRequestDTO, userId);

            var pageSize = transactionsRequestDTO.PageSize;
            var pageNumber = transactionsRequestDTO.PageNumber;

            transactionsDTO.TotalCount = count;
            transactionsDTO.Transactions = mapper.Map<List<TransactionViewModel>>(transactions);
            transactionsDTO.PageSize = pageSize == 0 ? count : pageSize;
            transactionsDTO.CurrentPage = pageNumber;
            transactionsDTO.PageBalance = pageBalance;
            transactionsDTO.NetBalance = await userRepository.GetUserBalanceByIDAsync(userId);

            return transactionsDTO;
        }
    }
}
