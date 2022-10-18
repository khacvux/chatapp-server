import { Socket } from 'socket.io';

export type AuthPayload = {
  id: number;
  username: string;
};

export type SocketWithAuth = Socket & AuthPayload;
