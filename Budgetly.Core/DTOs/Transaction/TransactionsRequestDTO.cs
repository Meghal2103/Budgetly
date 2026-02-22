namespace Budgetly.Core.DTOs.Transaction
{
    public class TransactionsRequestDTO
    {
        public string? SearchText { get; set; }
        public int CategoryId { get; set; }
        public int TransactionTypeID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
    }
}
