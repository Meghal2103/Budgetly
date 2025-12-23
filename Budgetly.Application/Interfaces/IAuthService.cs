using Budgetly.Application.DTOs.Auth;
using Budgetly.Core.DTOs.User;

namespace Budgetly.Application.Interfaces
{
    public interface IAuthService
    {
        Task<UserDTO> RegisterAsync(UserRegistration userRegistration);
        Task<string?> LoginAsync(LoginRequest loginRequest);
    }
}
