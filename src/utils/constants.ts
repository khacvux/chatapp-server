export enum Routes {
    // AUTH
    AUTH = 'auth',
    SIGN_IN = 'signin',
    SIGN_UP = 'signup',

    // CHAT
    CHAT = 'chat',
    GET_CHAT_LIST = 'list',

    // FRIENDS
    FRIENDS = 'f',
    ADD_FRIEND = 'add',
    DELETE_FRIEND = ':id/delete',

    // FRIEND REQUEST
    FRIENDS_REQUEST = 'f-req',
    ACCEPT_FRIENDS_REQUEST = ':id/accept',
    CANCEL_FRIENDS_REQUEST = ':id/cancel',
    REFUSE_FRIENDS_REQUEST = ':id/refuse',

}

export enum Services {
    GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER'
}
