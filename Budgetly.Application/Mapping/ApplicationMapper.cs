using Budgetly.Application.DTOs.Auth;
using Budgetly.Core.Entities;
using AutoMapper;
using Budgetly.Core.DTOs.User;
using Budgetly.Core.DTOs.Transaction;

namespace Budgetly.Application.Mapping
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<UserRegistration, User>();
            CreateMap<User, UserDTO>();
            CreateMap<AddEditTransaction, Transaction>();
            CreateMap<Transaction, TransactionDTO>();
        }
    }
}
