export default class ThreadModel {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public user_id: string,
    public created_at?: Date,
    public updated_at?: Date,
    public deleted_at?: Date
  ) {}
}
