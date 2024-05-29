export default class MaterialModel {
  constructor(
    public id: string,
    public title: string,
    public type: string,
    public description?: string,
    public file_url?: string
  ) {}
}
