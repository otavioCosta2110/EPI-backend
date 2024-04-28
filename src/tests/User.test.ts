import UserServices from '../services/userServices';
import UserRepository from '../repositories/userRepositories';
import UserModel from '../models/userModel';

jest.mock('../repositories/userRepositories');

describe('UserServices', () => {
  let userServices: UserServices;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    UserRepository.prototype.createUser = jest.fn();
    UserRepository.prototype.getUserByEmail = jest.fn();
    UserRepository.prototype.updateName = jest.fn();
    userServices = new UserServices(userRepository);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password12$',
        name: 'Test User',
        role: 'user'
      };

      (userRepository.createUser as jest.Mock).mockResolvedValue(user);

      const result = await userServices.create(user);
      console.log('result: ',result)

      expect(result).toEqual(user);
    });

    it('should throw an error if required fields are missing', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password12#'
      };

      await expect(userServices.create(user)).rejects.toThrow('Missing fields');
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw an error if the email is invalid', async () => {
      const user = {
        email: 'test@example',
        password: 'password12$',
        name: 'Test User',
        role: 'user'
      };

      await expect(userServices.create(user)).rejects.toThrow('Invalid email');
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw an error if the password is invalid', async () => {
      const user = {
        email: 'test@example.com',
        password: 'pass',
        name: 'Test User',
        role: 'user'
      };

      await expect(userServices.create(user)).rejects.toThrow('Invalid password');
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw an error if the user already exists', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password12#',
        name: 'Test User',
        role: 'user'
      };

      const existingUser = new UserModel('1', 'Test User', 'test@example.com', 'hashedPassword', 'user');

      (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(existingUser);

      await expect(userServices.create(user)).rejects.toThrow('User already exists');
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('updateName', () => {
    it('should update the name of an existing user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'newPassword12$',
        name: 'Test User',
        role: 'user'
      };
    
      const existingUser = new UserModel('1', 'Test User', 'test@example.com', 'hashedPassword', 'user');
    
      (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(existingUser);
      (userRepository.updateName as jest.Mock).mockResolvedValue(user);
    
      const result = await userRepository.updateName(user.email, user.name);
      console.log('result: ', result);
    
      expect(result).toEqual(user);
    });
    

    it('should throw an error if the user does not exist', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password12$',
        name: 'Test User',
        role: 'user'
      };

      (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(userServices.updateName(user.email, user.name, user.password)).rejects.toThrow('User not found');
      expect(userRepository.updateName).not.toHaveBeenCalled();
    });
  });
});

