using System.ComponentModel.DataAnnotations;

namespace Budgetly.Application.DTOs.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email is Requierd")]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is Requierd")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}
