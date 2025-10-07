using Budgetly.Application.DTOs.Auth;
using Budgetly.Application.DTOs.User;

namespace Budgetly.Application.Interfaces
{
    public interface IAuthService
    {
        Task<UserDTO> RegisterAsync(UserRegistration userRegistration);
        Task<string?> LoginAsync(LoginRequest loginRequest);
    }
}
