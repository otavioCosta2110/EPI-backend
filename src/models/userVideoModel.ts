export default class UserVideoModel {
  constructor(
    public user_id: string,
    public video_id: string,
    public play_count: number = 1,
    public last_played?: Date
  ) {}
}
