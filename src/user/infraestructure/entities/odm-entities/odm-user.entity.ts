import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumUserRole } from 'src/user/domain/user-role/user-role';

@Schema()
export class OdmUserEntity extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true, unique: true })
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  role: EnumUserRole;

  @Prop({required: false})
  image?: string;

  @Prop({ required: false, unique: true })
  phone?: string;

  @Prop({ required: false, unique: false, default: 'CLIENT'})
  type: string;

}

export const UserSchema = SchemaFactory.createForClass(OdmUserEntity);