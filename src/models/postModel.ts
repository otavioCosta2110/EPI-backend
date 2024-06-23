export default class PostModel {
  constructor(
    public id: string,
    public content: string,
    public user_id: string,
    public thread_id: string | null,
    public post_id: string,
    public video_id: string | null,
    public votes: number,
    public created_at?: Date,
    public updated_at?: Date,
    public deleted_at?: Date
  ) {}
}
