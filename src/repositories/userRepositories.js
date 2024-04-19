class UserRepository {
  constructor() {
    this.users = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];
  }
  async getUsers() {
    return this.users;
  }

}

module.exports = UserRepository;
