export enum Routes {
  // AUTH
  AUTH = 'auth',
  SIGN_IN = 'signin',
  SIGN_UP = 'signup',

  //USER
  USER = 'user',
  GET_PEERID = ':id/peerid',
  UPDATE_PEERID = 'peerid/update',
  DELETE_PEERID = 'peerid/delete',

  // CHAT
  CHAT = 'chat',
  GET_CHATS = 'getchats',
  GET_USERS = 'getusers',
  GET_CHAT_LIST = ':id/list',

  // FRIENDS
  FRIENDS = 'f',
  ADD_FRIEND = 'add',
  DELETE_FRIEND = ':id/delete',
  SEARCH_FRIEND = 'search/:querry',

  // FRIEND REQUEST
  FRIENDS_REQUEST = 'freq',
  CREATE_FRIENDS_REQUEST = ':id/create',
  ACCEPT_FRIENDS_REQUEST = ':id/accept',
  CANCEL_FRIENDS_REQUEST = ':id/cancel',
  REJECT_FRIENDS_REQUEST = ':id/reject',

  //GROUP
  GROUP = 'g',
  GET_GROUPS = '/list',
  GET_GROUP = ':id',
  CREATE_GROUP = 'create',
  UPDATE_GROUP_OWNER = ':id/owner',
  UPDATE_GROUP_DETAIL = ':id/details',

  GROUP_RECIPIENTS = 'g/:id/recipients',
  GROUP_RECIPIENT_ADD = 'add',
  GROUP_RECIPIENT_LEAVE = 'leave',
  GROUP_RECIPIENT_DELETE = 'delete',

  GROUP_CHAT_LIST = '/:id',
}
export enum Secret {
    JWT_SECRET = 'JWT_SECRET'
}
export enum Token {
    EXPIRES_IN = '365d'
}
export enum User {
    ID = 'id',
    USERNAME = 'username',
    HASH = 'hash',
    EMAIL = 'email',
    FIRSTNAME = 'firstName',
    LASTNAME = 'lastName',
    CREATEAT = 'createAt',
    UPDATEAT = 'updateAt',
}
export enum Chat {
    SEND_MESSAGE = "sendMessage",
    RECEIVE_MESSAGE = "receiveMessage"
}

export enum Services {
  GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER',
}

export enum WebsocketEvents {

}
