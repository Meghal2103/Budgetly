namespace Budgetly.Core.DTOs.Transaction
{
    public class TransactionsRequestDTO
    {
        public string? SearchText { get; set; }
        public int? CategoryId { get; set; }
        public int? TransactionTypeId { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
    }
}
