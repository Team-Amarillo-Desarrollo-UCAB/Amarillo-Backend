import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SaveTokenAdressEntryDto {
    @ApiProperty({
        example: "APA91bEWJZmYxmlVGtCa_39DoSjesfEPsWjY8ve-G2zv1oaWVcLajFbUWf0Ry_rur5Ct2zqXeByd_ohuV0y-hA8C0D0b8qn_nl2lMjT7Cq_ju5wqG-NoOao"
    })
    @IsString()
    token: string
}