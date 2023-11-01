import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

import { SOCKET_EVENTS } from 'src/consts.ts';
import { CanvasComponentProps } from 'src/modules/main/types.ts';

import styles from './main.module.css';

let interval: NodeJS.Timer | null = null;

const CanvasComponent: React.FC<CanvasComponentProps> = ({ socket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // State to manage the streaming status.
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  useEffect(() => {
    // Listener for receiving canvas data from the socket.
    socket.on(SOCKET_EVENTS.RECEIVE_CANVAS_DATA, data => {
      setIsStreaming(true);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = new Image();

      // When the image loads, draw it onto the canvas.
      img.onload = function () {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = data;
    });

    // Listener for stopping the streaming of canvas data.
    socket.on(SOCKET_EVENTS.STOP_STREAMING_CANVAS, () => {
      setIsStreaming(false);
    });

    // Cleanup listeners when the component unmounts.
    return () => {
      socket.off(SOCKET_EVENTS.STOP_STREAMING_CANVAS);
      socket.off(SOCKET_EVENTS.RECEIVE_CANVAS_DATA);
    };
  }, [socket, canvasRef.current]);

  // Function to send the canvas data (screenshot of iframe) via socket.
  const sendCanvasData = async () => {
    setIsStreaming(true);

    interval = setInterval(async () => {
      if (socket) {
        // Convert the iframe content to a canvas.
        const canvas = await html2canvas(iframeRef.current?.contentDocument?.body as HTMLElement);

        // Convert the canvas to a data URL.
        const dataURL = canvas.toDataURL();

        // Send the canvas data to the socket.
        socket.emit(SOCKET_EVENTS.SEND_CANVAS_DATA, dataURL);
      }
    }, 1000 / 30); // Stream at 30fps.
  };

  // Stop streaming.
  useEffect(() => {
    if (!isStreaming && interval && typeof interval === 'number') {
      clearInterval(interval);
    }
  }, [isStreaming]);

  // Check if the current user is the host from local storage.
  const isHost = localStorage.getItem('isHost');

  return (
    <>
      <div className={styles.wrapper}>
        {/* Display the canvas only if the user is not the host and streaming is active. */}
        {!isHost && isStreaming && (
          <div className={styles.canvasWrapper}>
            <canvas ref={canvasRef} width='1000px' height='1500px'></canvas>
          </div>
        )}
        {/* Display the iframe only for the host. */}
        {isHost && <iframe ref={iframeRef} src='https://localhost:5173/'></iframe>}
        <button onClick={sendCanvasData}>Start streaming iframe</button>
        <button
          onClick={() => {
            socket.emit(SOCKET_EVENTS.STOP_STREAMING_CANVAS);
            setIsStreaming(false);
          }}
        >
          Stop streaming
        </button>
        <button onClick={() => localStorage.setItem('isHost', 'true')}>Set is Host</button>
      </div>
    </>
  );
};

export default CanvasComponent;
