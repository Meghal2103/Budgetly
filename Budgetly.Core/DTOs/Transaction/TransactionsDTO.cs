using Budgetly.Core.ViewModel;

namespace Budgetly.Core.DTOs.Transaction
{
    public class TransactionsDTO
    {
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public decimal NetBalance { get; set; } = 0;
        public decimal PageBalance { get; set; } = 0;
        public List<TransactionViewModel>? Transactions { get; set; }
    }
}
