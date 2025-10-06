using Budgetly.Application.DTOs;

namespace Budgetly.Core.Interfaces.Services
{
    public interface IAuthServices
    {
        string HashPassword(LoginDTO loginDTO);
    }
}
