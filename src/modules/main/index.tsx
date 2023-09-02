import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonWithTranslate } from '../../components/buttonWithTranslate';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePIP } from '../../hooks/usePIP.tsx';
import { dispatchNotification } from '../../utils.ts';
import { useSocketIO } from '../../hooks/useSocketIO.tsx';

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

    socket.emit('new message', message);
    socket.emit('stop typing');

    // Check is the Document Picture-in-Picture API supported.
    if ('documentPictureInPicture' in window && pipWindow) {
      dispatchNotification(newMessage, pipWindow);
    }

    setMessages([...messages, newMessage]);
    setIsTyping(false);
  };

  const onInputHandle = () => {
    socket.emit('typing');
    setIsTyping(true);
  };

  const logInHandle = () => {
    socket.emit('add user', username);
  };

  const setUserNameHandle = (e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);

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
          onChange={e => setMessage(e.target.value)}
        />
        {isTyping && <span>{t('typing')}</span>}
        <ButtonWithTranslate i18Key='sendMessage' handle={sendMessageHandle} />
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
