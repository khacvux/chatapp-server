import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePeerIdDto {
    @IsNotEmpty()
    @IsString()
    peerId: string
}