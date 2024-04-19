const UserRepository = require("../repositories/userRepositories").default;

class UserServices {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUsers() {
    return this.userRepository.getUsers();
  }
  
}

module.exports = UserServices;
