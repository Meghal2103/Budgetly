using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Budgetly.Core.Entities
{
    public class TransactionType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TransactionTypeID { get; set; }

        [Required]
        [StringLength(100)]
        public string TransactionTypeName { get; set; } = string.Empty;

        [JsonIgnore]
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
