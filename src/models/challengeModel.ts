export default class ChallengeModel {
  constructor(
    public id: string,
    public title: string,
    public type: string,
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public video_id?: string,
    public file_url?: string
  ) {}
}
