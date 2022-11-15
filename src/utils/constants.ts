export enum Routes {
    // AUTH
    AUTH = 'auth',
    SIGN_IN = 'signin',
    SIGN_UP = 'signup',

    // CHAT
    CHAT = 'chat',
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
    UPDATE_GROUP_DETAIL = ':id/details'
}

export enum Services {
    GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER'
}
