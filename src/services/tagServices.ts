import TagModel from "../models/tagModel";
import TagRepository from "../repositories/tagRepositories";
import { v4 as uuidv4 } from 'uuid';

export default class TagServices{
  tagRepository = new TagRepository()

  constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository;
  }

  getTags = async () => {
    const tags = await this.tagRepository.getTags();
    return tags;
  }

  create = async (tag: any) : Promise<any> => {
    if (!tag.name) {
      throw new Error("Missing fields");
    }
    const tagExists = await this.tagRepository.getTagByName(tag.name);
    if (tagExists) {
      throw new Error("Tag already exists");
    }
    const tagID = uuidv4();
    const newTag = new TagModel(tagID, tag.name);
    const createdTag =  await this.tagRepository.createTag(newTag);
    return createdTag;
  }

  delete = async (tagId: string): Promise<TagModel> => {
    const tag = await this.tagRepository.getTagById(tagId);
    const user = await this.tagRepository.getUserByTagId(tagId);
    // if (user.isUserTag) {
    //   throw new Error("This tag is in use");
    // }
    if (!tag) {
      throw new Error("Tag not found");
    }
    const deletedTag = await this.tagRepository.deleteTag(tagId);
    return deletedTag;
  }

}
