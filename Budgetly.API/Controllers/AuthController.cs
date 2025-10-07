using Budgetly.API.Models;
using Budgetly.Application.DTOs.Auth;
using Budgetly.Application.DTOs.User;
using Budgetly.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Budgetly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            APIResponse<object> response = new APIResponse<object>();

            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));

                return BadRequest(response);
            }

            string? token = await authService.LoginAsync(loginRequest);
            if (token == null)
            {
                response.Success = false;
                response.Message = "Invalid password.";
                return Unauthorized(response);
            }

            response.Success = true;
            response.Message = "Login successful.";
            response.Token = token;
            return Ok(response);
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> Register([FromBody] UserRegistration userRegistration)
        {
            APIResponse<UserDTO> response = new APIResponse<UserDTO>();

            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));

                return BadRequest(response);
            }

            UserDTO userDTO = await authService.RegisterAsync(userRegistration);
            response.Success = true;
            response.Message = "Registration successful. Please Login";
            response.Data = userDTO;
            return Ok(response);
        }
    }
}
