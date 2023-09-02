import { SocketEvents } from './types.ts';

export const HOST_URL = 'http://localhost:8000';

export const TYPE_MESSAGE = {
  JOIN: 'JOIN',
  LEAVE: 'LEAVE',
};

export const SOCKET_EVENTS: SocketEvents = {
  DISCONNECT: 'disconnect',
  LOGIN: 'login',
  USER_JOINED: 'user joined',
  USER_LEFT: 'user left',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  RECONNECT: 'reconnect',
  NEW_MESSAGE: 'new message',
  RECONNECT_ERROR: 'reconnect_error',
  ADD_USER: 'add user',
};
