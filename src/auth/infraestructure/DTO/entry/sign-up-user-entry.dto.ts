import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator';
import { EnumUserRole } from 'src/user/domain/user-role/user-role';

export class SignUpUserEntryInfraDto {

    @ApiProperty({ required: true, default: 'CLIENT' })
    @IsString()
    @IsIn(['CLIENT', 'ADMIN'])
    @IsOptional()
    type: EnumUserRole;

    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string

    @ApiProperty({ example: 'arrozconcanela22' })
    @IsString()
    password: string

    @ApiProperty({ example: 'Carlos' })
    @IsString()
    name: string

    @ApiProperty({ example: '04131234123' })
    @IsString()
    phone: string

    @ApiProperty({
        example: 'base64image',
    })
    @IsString()
    @IsOptional()
    image?: string;

}