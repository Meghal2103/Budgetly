using AutoMapper;
using Budgetly.Application.Exceptions;
using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;
using Budgetly.Core.Interfaces.Services;
using Budgetly.Core.ViewModel;
using ClosedXML.Excel;

namespace Budgetly.Application.Services
{
    internal class TransactionService(ITransactionRepository transactionRepository, IMapper mapper, ICurrentUserService currentUserService, IUserRepository userRepository) : ITransactionService
    {
        public async Task<TransactionViewModel> AddTransaction(AddEditTransaction addEditTransaction)
        {
            var userId = currentUserService.UserId
                ?? throw new UnauthorizedAccessException("User not authenticated.");
            if (addEditTransaction.TransactionTypeID == 0)
                throw new InvalidField("Transaction Type");
            if (addEditTransaction.CategoryId == 0)
                throw new InvalidField("Category Type");
            var transaction = mapper.Map<Transaction>(addEditTransaction);
            transaction.UserId = userId;
            await transactionRepository.AddTransactionAsync(transaction);
            return mapper.Map<TransactionViewModel>(transaction);
        }
      
        public async Task<List<TransactionType>> GetTransactionType()
        {
            var transactionTypes = await transactionRepository.GetTransactionType();
            transactionTypes.Insert(0, new TransactionType
            {
                TransactionTypeID = 0,
                TransactionTypeName = "All Transaction Type"
            });
            return transactionTypes;
        }

        public async Task<List<Category>> GetCategories()
        {
            var categories = await transactionRepository.GetCategories();
            categories.Insert(0, new Category
            {
                CategoryId = 0,
                CategoryName = "All Categories",
            });
            return categories;
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

        public async Task<TransactionViewModel> GetTransactionsDetails(int transactionID)
        {
            var userId = currentUserService.UserId
                ?? throw new UnauthorizedAccessException("User not authenticated.");
            TransactionViewModel transactionViewModel = new();
            transactionViewModel = mapper.Map<TransactionViewModel>(await transactionRepository.GetTransactionsDetails(userId, transactionID));

            return transactionViewModel;
        }

        public async Task<byte[]> ExportAllTransactionsExcel()
        {
            var userId = currentUserService.UserId
                ?? throw new UnauthorizedAccessException("User not authenticated.");

            var (count, transactions) = await transactionRepository.GetTransactions(userId);
            return BuildTransactionsExcel(count, transactions);
        }

        public async Task<byte[]> ExportTransactionsExcel(TransactionsRequestDTO transactionsRequestDTO)
        {
            var userId = currentUserService.UserId
                ?? throw new UnauthorizedAccessException("User not authenticated.");

            var (count, pageBalance, transactions) = await transactionRepository.RequestTransactions(transactionsRequestDTO, userId);
            return BuildTransactionsExcel(count, transactions);
        }

        private static byte[] BuildTransactionsExcel(int count, List<Transaction> transactions)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Transactions");
            worksheet.Cell(1, 1).Value = $"Total Transactions = {count}";
            worksheet.Cell(2, 1).Value = "Date";
            worksheet.Cell(2, 2).Value = "Title";
            worksheet.Cell(2, 3).Value = "CategoryId";
            worksheet.Cell(2, 4).Value = "TransactionTypeID";
            worksheet.Cell(2, 5).Value = "Amount";
            worksheet.Cell(2, 6).Value = "Notes";

            var row = 3;
            foreach (var transaction in transactions)
            {
                worksheet.Cell(row, 1).Value = transaction.DateTime;
                worksheet.Cell(row, 1).Style.DateFormat.Format = "yyyy-MM-dd HH:mm";
                worksheet.Cell(row, 2).Value = transaction.Title;
                worksheet.Cell(row, 3).Value = transaction.CategoryId;
                worksheet.Cell(row, 4).Value = transaction.TransactionTypeID;
                worksheet.Cell(row, 5).Value = transaction.Amount;
                worksheet.Cell(row, 6).Value = transaction.Notes;
                row++;
            }

            worksheet.Cell(row, 4).Value = "Total";
            worksheet.Cell(row, 5).Value = transactions.Sum(t => t.Amount);
            worksheet.Cell(row, 4).Style.Font.Bold = true;
            worksheet.Cell(row, 5).Style.Font.Bold = true;

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
