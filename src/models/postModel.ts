export default class PostModel {
  constructor(
    public id: string,
    public content: string,
    public user_id: string,
    public thread_id: string,
    public post_id: string,
    public votes: number,
    public created_at?: Date,
    public updated_at?: Date,
    public deleted_at?: Date
  ) {}
}
