import { Chat } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class GetChatDto {
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;
}
export interface IMessageDto{
  id: number;
  username: string;
}
export interface IChatReturn{
  statusCode:number;
  message?:string;
  chats?:Chat[];
}