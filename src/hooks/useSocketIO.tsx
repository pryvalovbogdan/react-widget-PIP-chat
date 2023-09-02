import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

import { dispatchNotification } from '../utils.ts';
import i18next from '@i18n/i18next.ts';

const socket = io('http://localhost:8000');

export const useSocketIO = (
  setIsTyping: (isTyping: boolean) => void,
  pipWindow: any,
  addParticipantsMessage: (data: { numUsers: number }) => void,
) => {
  useEffect(() => {
    socket.on('disconnect', reason => {
      console.log('reason', reason);
    });

    socket.on('login', data => {
      const message = i18next.t('welcomeToChat');

      toast(message);
      dispatchNotification(message, pipWindow, 'JOIN');
      addParticipantsMessage(data);
    });

    socket.on('user joined', data => {
      const joinMessage = i18next.t('userJoin', { username: data.username });

      toast(joinMessage);
      dispatchNotification(joinMessage, pipWindow, 'JOIN');
    });

    socket.on('user left', data => {
      const leftMessage = i18next.t('userLeft', { username: data.username });

      toast(leftMessage);
      dispatchNotification(leftMessage, pipWindow, 'LEAVE');
    });

    socket.on('typing', () => {
      setIsTyping(true);
    });

    socket.on('stop typing', () => {
      setIsTyping(false);
    });

    socket.on('disconnect', () => {
      console.log('you have been disconnected');
    });

    socket.io.on('reconnect', () => {
      console.log('you have been reconnected');
    });

    socket.io.on('reconnect_error', () => {
      console.log('attempt to reconnect has failed');
    });

    socket.on('new message', data => {
      dispatchNotification(data.message, pipWindow);
    });

    return () => {
      socket.off('disconnect');
      socket.off('login');
      socket.off('user joined');
      socket.off('new message');
      socket.off('user left');
    };
  }, [pipWindow]);

  return { socket };
};
