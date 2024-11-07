import { IValueObject } from 'src/common/Domain/value-object/value-object.interface';

export class UserImage implements IValueObject<UserImage> {
  private readonly url: string;

  protected constructor(url: string) {
    if (url.length < 5) 
        throw new Error('Invalid url');
    this.url = url;
  }

  get Image() {
    return this.url;
  }

  equals(valueObject: UserImage): boolean {
    return this.url === valueObject.Image;
  }

  static create(url: string) {
    return new UserImage(url);
  }
}
