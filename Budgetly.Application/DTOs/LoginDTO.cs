using System.ComponentModel.DataAnnotations;

namespace Budgetly.Application.DTOs
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        [StringLength(256)]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
