using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgetly.Core.Entities
{
    public class Transaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TransactionId { get; set; }

        [Required]
        public int UserId { get; set; }
        public required User User { get; set; }

        [Required]
        public int CategoryId { get; set; }
        public required Category Category { get; set; }

        [Required]
        public int TransactionTypeID { get; set; }
        public required TransactionType TransactionType { get; set; }

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
