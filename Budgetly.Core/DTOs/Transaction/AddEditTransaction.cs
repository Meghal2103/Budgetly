using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgetly.Core.DTOs.Transaction
{
    public class AddEditTransaction
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int TransactionTypeID { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime DateTime { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [StringLength(1024)]
        public string Notes { get; set; } = string.Empty;
    }
}
