import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { RTCIceCandidateInit, RTCSessionDescriptionInit } from 'webrtc';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket;
}

const WebRTCStreamingCanvas: React.FC<Props> = ({ socket }) => {
  // References to our iframe and video elements
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State to track if sharing is active
  const [isSharing, setIsSharing] = useState<boolean>(false);

  // WebRTC configuration, including ICE servers for NAT traversal
  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    iceCandidatePoolSize: 0,
    gatherPolicy: 'nohost', // This will exclude host candidates
  };

  // Initializing the WebRTC peer connection
  let peerConnection = new RTCPeerConnection(configuration);

  // Logging ICE connection state changes
  peerConnection.oniceconnectionstatechange = event => {
    console.log('ICE connection state:', event, peerConnection.iceConnectionState);
  };

  // Logging signaling state changes
  peerConnection.onsignalingstatechange = event => {
    console.log('Signaling state:', event, peerConnection.signalingState);
  };

  // Logging any errors related to ICE candidates
  peerConnection.onicecandidateerror = event => {
    console.log('ICE candidate error:', event);
  };

  // State to manage the video stream
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  // Ref to store pending ICE candidates
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  // Function to stop sharing the stream
  const stopSharing = () => {
    if (isSharing && peerConnection) {
      setIsSharing(false);
      peerConnection.close();
      peerConnection = null!;
    }
  };

  useEffect(() => {
    // Listening for an offer from the remote peer
    socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      // Handle any pending ICE candidates
      while (pendingCandidates.current.length > 0) {
        const iceCandidate = pendingCandidates.current.shift();
        if (iceCandidate && peerConnection.remoteDescription) {
          try {
            await peerConnection.addIceCandidate(iceCandidate);
          } catch (error) {
            console.error('Error adding queued ice candidate', error);
          }
        }
      }

      // Create an answer and send it back via the socket
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', peerConnection.localDescription);
    });

    // Handling incoming ICE candidates from the remote peer
    socket.on('ice-candidate', (iceCandidateData: RTCIceCandidateInit) => {
      const iceCandidate = new RTCIceCandidate(iceCandidateData);
      if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
        try {
          peerConnection.addIceCandidate(iceCandidate);
        } catch (error) {
          console.error('Error adding received ice candidate', error);
        }
      } else {
        // Queue the candidates until remote description is set
        pendingCandidates.current.push(iceCandidate);
      }
    });

    // Displaying the received video stream
    peerConnection.ontrack = function (event) {
      setVideoStream(event.streams[0]);
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0]; // assign the stream to the video element
      }
    };

    // Handling changes in ICE connection state
    peerConnection.oniceconnectionstatechange = function () {
      if (peerConnection.iceConnectionState === 'failed') {
        console.error('ICE connection failed.');
      }
    };

    // Emitting our own ICE candidates to the remote peer
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate.toJSON());
      }
    };

    // Handling the answer received from the remote peer
    socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      if (peerConnection.signalingState !== 'stable') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Cleaning up listeners when the component is unmounted
    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [peerConnection, videoRef.current]);

  const startSharing = () => {
    if (!isSharing && iframeRef.current) {
      // Convert the iframe content to a canvas and capture its stream
      html2canvas(iframeRef.current.contentDocument?.body as HTMLElement).then(canvas => {
        const stream = (canvas as any).captureStream(30, { video: { mimeType: 'video/webm;codecs=vp9' } });
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          if (track) {
            peerConnection.addTrack(track, stream);
          }
        });

        setIsSharing(true);

        // Creating and sending an offer to the remote peer
        peerConnection
          .createOffer()
          .then(offer => peerConnection.setLocalDescription(new RTCSessionDescription(offer)))
          .then(() => {
            socket.emit('offer', peerConnection.localDescription);
          });
      });
    }
  };

  return (
    <div>
      <iframe
        ref={iframeRef}
        src='http://localhost:5173/notes' // Change the URL to the one you want to load
        width='600'
        height='400'
      />
      <button onClick={startSharing}>Start Share</button>
      <button onClick={stopSharing}>Stop Share</button>
      <video ref={videoRef} playsInline autoPlay controls style={{ display: videoStream ? 'block' : 'none' }}></video>
      {videoStream && <button onClick={() => videoRef.current && videoRef.current.play()}>Play video</button>}
    </div>
  );
};

export default WebRTCStreamingCanvas;
