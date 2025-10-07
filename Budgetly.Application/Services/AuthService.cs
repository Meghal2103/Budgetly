using AutoMapper;
using Budgetly.Application.DTOs.Auth;
using Budgetly.Application.DTOs.User;
using Budgetly.Application.Exceptions;
using Budgetly.Application.Interfaces;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Repository;

namespace Budgetly.Application.Services
{
    internal class AuthService(ISecurityServices securityServices, IUserRepository userRepository, IMapper mapper) : IAuthService
    {
        public async Task<UserDTO> RegisterAsync(UserRegistration userRegistration)
        {
            User? user = await userRepository.GetByEmailAsync(userRegistration.Email);
            if (user != null)
            {
                throw new UserAlreadyExistsException(userRegistration.Email);
            }

            User newUser = mapper.Map<User>(userRegistration);
            newUser.Salt = securityServices.GenerateSalt();
            newUser.PasswordHash = securityServices.HashPassword(userRegistration.Password, newUser.Salt);

            newUser = await userRepository.AddUserAsync(newUser);
            return mapper.Map<UserDTO>(newUser);
        }

        public async Task<string?> LoginAsync(LoginRequest loginRequest)
        {
            User? user = await userRepository.GetByEmailAsync(loginRequest.Email);

            if (user == null)
            {
                throw new UserNotFoundException(loginRequest.Email);
            }

            if(user.PasswordHash == securityServices.HashPassword(loginRequest.Password, user.Salt))
            {
                return securityServices.GenerateToken(user);
            }
            return null;
        }
    }
}
