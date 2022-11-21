import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGroupMessageDto {
    @IsNumber()
    @IsNotEmpty()
    groupId: number

    @IsNumber()
    @IsNotEmpty()
    from: number

    @IsString()
    @IsNotEmpty()
    message: string
}