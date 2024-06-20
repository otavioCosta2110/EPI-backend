export default class UserModel {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: string,
    public tags: string[],
    public image_url?: string | null
  ) {}
}
