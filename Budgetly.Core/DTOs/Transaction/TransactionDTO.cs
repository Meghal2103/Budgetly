using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgetly.Core.DTOs.Transaction
{
    public class TransactionDTO
    {
        public int TransactionId { get; set; }

        public int UserId { get; set; }

        public int CategoryId { get; set; }

        public int TransactionTypeID { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [StringLength(1024)]
        public string Notes { get; set; }
    }
}
