using Budgetly.Application.DTOs.Auth;
using Budgetly.Core.Entities;
using AutoMapper;
using Budgetly.Application.DTOs.User;

namespace Budgetly.Application.Mapping
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<UserRegistration, User>();
            CreateMap<User, UserDTO>();
        }
    }
}
