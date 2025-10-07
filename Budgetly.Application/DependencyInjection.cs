using Budgetly.Application.Interfaces;
using Budgetly.Application.Services;
using Budgetly.Application.Mapping;
using AutoMapper;
using Budgetly.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Budgetly.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationDI(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<ApplicationMapper>();
            });

            services.AddCoreDI();

            return services;
        }
    }
}
