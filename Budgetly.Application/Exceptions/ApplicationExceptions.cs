namespace Budgetly.Application.Exceptions
{
    public class UserNotFoundException(string email) : Exception($"No user found with email {email}")
    {
        
    }

    public class UserAlreadyExistsException(string email) : Exception($"User with email {email} already exists.")
    {

    }
}
