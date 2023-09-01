import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonWithTranslate } from '../../components/buttonWithTranslate';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePIP } from '../../hooks/usePIP.tsx';
import { dispatchNotification } from '../../utils.ts';
import { useSocketIO } from '../../hooks/useSocketIO.tsx';

const Main = () => {
  const [count, setCount] = useState(0);
  const [username, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { t } = useTranslation();

  const { addParticipantsMessage, openDocumentPIP, pipWindow } = usePIP(dispatchNotification);
  const { socket } = useSocketIO(setIsTyping, pipWindow, addParticipantsMessage);

  const sendMessageHandle = () => {
    socket.emit('new message', message);
    socket.emit('stop typing');
    if (pipWindow) {
      dispatchNotification(message, pipWindow);
    }
    setMessages([...messages, message]);
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
      <div className='card' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        Enter your name: <input onChange={setUserNameHandle} value={username} placeholder='name' />
        <button onClick={logInHandle}>Log in Chat</button>
        Write message:{' '}
        <input
          value={message}
          placeholder='message'
          onInput={onInputHandle}
          onChange={e => setMessage(e.target.value)}
        />
        {isTyping && <span>Typing....</span>}
        <button onClick={sendMessageHandle}>Send message</button>
        <ButtonWithTranslate i18Key='count' handle={() => setCount(count => count + 1)} i18Value={count} />
        <button id='button' onClick={openDocumentPIP}>
          Pip
        </button>
      </div>
    </>
  );
};

export default Main;
