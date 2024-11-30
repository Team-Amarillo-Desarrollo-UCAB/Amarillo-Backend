import { IValueObject } from 'src/common/domain/value-object/value-object.interface';

export class UserImage implements IValueObject<UserImage> {
  private readonly url: string;

  protected constructor(url: string){
      this.url = url
  }

  get Image(): string{
      return this.url
  }

  equals(valueObject: UserImage): boolean {
      return this.url === valueObject.Image
  }

  static create(url: string): UserImage{
      return new UserImage(url)
  }
}
