export type SocketEvents = {
  DISCONNECT: 'disconnect';
  LOGIN: 'login';
  USER_JOINED: 'user joined';
  USER_LEFT: 'user left';
  TYPING: 'typing';
  STOP_TYPING: 'stop typing';
  RECONNECT: 'reconnect';
  NEW_MESSAGE: 'new message';
  RECONNECT_ERROR: 'reconnect_error';
  ADD_USER: 'add user';
};
