export default class VideoModel {
  constructor(
    public id: string,
    public title: string,
    public url: string,
    public description: string,
    public tags: string[],
    public rating: number,
    public timesRated: number
  ) {}
}
