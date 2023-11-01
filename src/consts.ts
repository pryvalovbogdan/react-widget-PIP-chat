import { SocketEvents } from './types.ts';

export const HOST_URL = 'http://localhost:8000';

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
  RECEIVE_CANVAS_DATA: 'receive-canvas-data',
  STOP_STREAMING_CANVAS: 'stop-streaming-canvas',
  SEND_CANVAS_DATA: 'send-canvas-data',
};

export const TYPE_MESSAGE = {
  JOIN: 'JOIN',
  LEAVE: 'LEAVE',
};
