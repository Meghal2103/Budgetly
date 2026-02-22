using System.ComponentModel.DataAnnotations;

namespace Budgetly.Application.DTOs.Auth
{
    public class UserRegistration
    {
        [Required(ErrorMessage = "Email is Requierd")]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "First Name is Requierd")]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lat Name is Requierd")]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateOnly DateOfBirth { get; set; }

        [Required(ErrorMessage = "Password is Requierd")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}
