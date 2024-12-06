import { ApiProperty } from "@nestjs/swagger"

export class CurrentUserSwaggerResponseDto {
    @ApiProperty({ example: '124124-1241241-12412412' })
    id: string
    @ApiProperty({ example: 'carlonzo@gmail.com' })
    email: string
    @ApiProperty({ example: 'Carlos Alonzo' })
    name: string
    @ApiProperty({ example: '04121231231' })
    phone: string
    @ApiProperty({
        example: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731483047/kkizccq7zv9j37jg0hi3.png"
    })
    image?: string
    
}