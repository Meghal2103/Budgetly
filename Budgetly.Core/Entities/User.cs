using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Budgetly.Core.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = 0;

        [Required]
        [DataType(DataType.Password)]
        [StringLength(256)]
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(256)]
        [JsonIgnore]
        public string Salt { get; set; } = string.Empty;

        [JsonIgnore]
        public virtual ICollection<Transaction> Transactions { get; set; } = [];
    }
}
