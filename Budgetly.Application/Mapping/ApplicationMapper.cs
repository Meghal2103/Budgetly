using AutoMapper;
using Budgetly.Application.DTOs.Auth;
using Budgetly.Core.DTOs.Transaction;
using Budgetly.Core.DTOs.User;
using Budgetly.Core.Entities;
using Budgetly.Core.ViewModel;

namespace Budgetly.Application.Mapping
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<UserRegistration, User>();
            CreateMap<User, UserDTO>();
            CreateMap<AddEditTransaction, Transaction>();
            CreateMap<Transaction, TransactionViewModel>();
        }
    }
}
