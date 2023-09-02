import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonWithTranslate } from 'src/components/buttonWithTranslate';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePIP, useSocketIO } from 'src/hooks';
import { dispatchNotification } from 'src/utils.ts';
import { SOCKET_EVENTS } from 'src/consts.ts';

const Main = () => {
  const [username, setUserName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const { t } = useTranslation();

  const addMessage = (mes: string) => setMessages(prev => [...prev, mes]);

  const { addParticipantsMessage, openDocumentPIP, pipWindow, isPIPOpen } = usePIP(messages);
  const { socket } = useSocketIO(setIsTyping, pipWindow, addParticipantsMessage, addMessage);

  const sendMessageHandle = () => {
    const newMessage = t('youMessage', { message });
    // Emmiting sending message to all users and stoping typing afte it.
    socket.emit(SOCKET_EVENTS.NEW_MESSAGE, message);
    socket.emit(SOCKET_EVENTS.STOP_TYPING);

    // Check is the Document Picture-in-Picture API supported.
    if ('documentPictureInPicture' in window && pipWindow) {
      dispatchNotification(newMessage, pipWindow);
    }

    setMessages([...messages, newMessage]);
    setIsTyping(false);
  };
  // Adding typing where someone starts writing in chat.
  const onInputHandle = () => {
    socket.emit(SOCKET_EVENTS.TYPING);
    setIsTyping(true);
  };
  // Emmiting event for all connected users that current user logged.
  const logInHandle = () => {
    socket.emit(SOCKET_EVENTS.ADD_USER, username);
  };

  const setUserNameHandle = (e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);
  const setMessageHandle = (e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  return (
    <>
      <ToastContainer />
      <h1>{t('react')}</h1>
      <div className='card'>
        {t('name')}
        <input onChange={setUserNameHandle} value={username} placeholder={t('enterYourName')} />
        <ButtonWithTranslate i18Key='logInChat' handle={logInHandle} />
        {t('message')}
        <input
          value={message}
          placeholder={t('enterYourMessage')}
          onInput={onInputHandle}
          onChange={setMessageHandle}
        />
        {isTyping && <span>{t('typing')}</span>}
        <ButtonWithTranslate i18Key='sendMessage' handle={sendMessageHandle} />
        {/* Adding chat on general page if PIP window was closed with messages from it. */}
        {!isPIPOpen && (
          <div className='local-chat'>
            {messages.map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )}
        <ButtonWithTranslate i18Key='pip' handle={openDocumentPIP} />
      </div>
    </>
  );
};

export default Main;
