import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Socket } from 'socket.io-client';
interface CanvasComponentProps {
  socket: Socket;
}

let interval: NodeJS.Timer | null = null;

const CanvasComponent: React.FC<CanvasComponentProps> = ({ socket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  useEffect(() => {
    // Listener for receiving canvas data
    socket.on('receive-canvas-data', data => {
      setIsStreaming(true);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = new Image();

      img.onload = function () {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = data;
    });

    socket.on('stop-streaming-canvas', () => {
      setIsStreaming(false);
    });

    return () => {
      socket.off('receive-canvas-data');
      socket.off('top-streaming-canvas');
    };
  }, [socket, canvasRef.current]);

  const sendCanvasData = async () => {
    setIsStreaming(true);

    interval = setInterval(async () => {
      if (socket) {
        const canvas = await html2canvas(iframeRef.current?.contentDocument?.body as HTMLElement);

        const dataURL = canvas.toDataURL();

        socket.emit('send-canvas-data', dataURL);
      }
    }, 1000 / 30);
  };

  useEffect(() => {
    if (!isStreaming && interval && typeof interval === 'number') {
      clearInterval(interval);
    }
  }, [isStreaming]);

  const isHost = localStorage.getItem('isHost');

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!isHost && isStreaming && (
          <div style={{ maxHeight: '556px', maxWidth: '556px', overflow: 'scroll' }}>
            <canvas ref={canvasRef} width={'1000px'} height={'1500px'}></canvas>
          </div>
        )}
        {isHost && <iframe ref={iframeRef} src='http://localhost:5173/proxy'></iframe>}
        <button onClick={sendCanvasData}>Start streaming iframe</button>
        <button
          onClick={() => {
            socket.emit('stop-streaming-canvas');
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
