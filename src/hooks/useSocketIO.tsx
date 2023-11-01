import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

import i18next from '@i18n/i18next.ts';

import { dispatchNotification } from '../utils.ts';
import { HOST_URL, SOCKET_EVENTS, TYPE_MESSAGE } from '../consts.ts';

const socket = io(HOST_URL, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000, // Starts with 2 sec delay, then increases
  reconnectionDelayMax: 10000, // Max delay is 10 sec
});

export const useSocketIO = (
  setIsTyping: (isTyping: boolean) => void,
  pipWindow: any,
  addParticipantsMessage: (data: { numUsers: number }) => void,
  addMessage: (mes: string) => void,
) => {
  useEffect(() => {
    socket.on(SOCKET_EVENTS.LOGIN, data => {
      const message = i18next.t('welcomeToChat');

      toast(message);
      dispatchNotification(message, pipWindow, TYPE_MESSAGE.JOIN);
      addParticipantsMessage(data);
    });

    socket.on(SOCKET_EVENTS.USER_JOINED, data => {
      const joinMessage = i18next.t('userJoin', { username: data.username });

      toast(joinMessage);
      dispatchNotification(joinMessage, pipWindow, TYPE_MESSAGE.JOIN);
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, data => {
      const leftMessage = i18next.t('userLeft', { username: data.username });

      toast(leftMessage);
      dispatchNotification(leftMessage, pipWindow, TYPE_MESSAGE.LEAVE);
    });

    socket.on(SOCKET_EVENTS.TYPING, () => {
      setIsTyping(true);
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, () => {
      setIsTyping(false);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('you have been disconnected');
    });

    socket.io.on(SOCKET_EVENTS.RECONNECT, () => {
      console.log('you have been reconnected');
    });

    socket.io.on(SOCKET_EVENTS.RECONNECT_ERROR, () => {
      console.log('attempt to reconnect has failed');
    });

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, data => {
      const newMessage = `${data.username}: ${data.message}`;

      dispatchNotification(newMessage, pipWindow);
      addMessage(newMessage);
    });

    return () => {
      socket.off(SOCKET_EVENTS.DISCONNECT);
      socket.off(SOCKET_EVENTS.LOGIN);
      socket.off(SOCKET_EVENTS.USER_JOINED);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE);
      socket.off(SOCKET_EVENTS.USER_LEFT);
    };
  }, [pipWindow]);

  return { socket };
};
