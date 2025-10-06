using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Budgetly.Core.Entities;
using Budgetly.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Budgetly.Infrastructure.Services
{
    public class SecurityServices(IConfiguration configuration) : ISecurityServices
    {
        public string HashPassword(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var combined = password + salt;
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(combined));
            return Convert.ToBase64String(bytes);
        }

        public string GenerateToken(Guid userId, User user)
        {
            string? secretKey = configuration["Jwt:SecretKey"];
            string? issuer = configuration["Jwt:Issuer"];
            string? audience = configuration["Jwt:Audience"];

            JwtSecurityTokenHandler? tokenHandler = new JwtSecurityTokenHandler();
            byte[]? key = Encoding.UTF8.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new[] {
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.Name, user.FirstName),
                        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    }),
                Expires = DateTime.UtcNow.AddHours(24),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
    }
}
