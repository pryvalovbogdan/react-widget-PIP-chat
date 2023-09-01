import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { dispatchNotification } from '../utils.ts';

const socket = io('http://localhost:8000');

export const useSocketIO = (setIsTyping: (isTyping: boolean) => void, pipWindow: any, addParticipantsMessage: any) => {
  useEffect(() => {
    socket.on('disconnect', reason => {
      console.log('reason', reason);
    });

    // Whenever the server emits 'login', log the login message
    socket.on('login', data => {
      // Display the welcome message
      const message = 'Welcome to Chat';

      toast(message);
      addParticipantsMessage(data);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', data => {
      dispatchNotification(`${data.username} joined`, pipWindow, 'JOIN');
      toast(`${data.username} joined`);
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', data => {
      console.log(`${data.username} left`);
      toast(`${data.username} left`);
      dispatchNotification(`${data.username} left`, pipWindow, 'LEAVE');
    });

    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', data => {
      setIsTyping(true);
      console.log('data', data);
      // addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', () => {
      console.log('stop typing');
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
      console.log('new message', data);
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
