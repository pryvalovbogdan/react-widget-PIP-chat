import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { RTCIceCandidateInit, RTCSessionDescriptionInit } from 'webrtc';

const WebRTCStreamingCanvas: React.FC = ({ socket }: any) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  let peerConnection: RTCPeerConnection;

  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    iceCandidatePoolSize: 0,
    gatherPolicy: 'nohost', // This will exclude host candidates
  };

  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.oniceconnectionstatechange = event => {
    console.log('ICE connection state:', event, peerConnection.iceConnectionState);
  };

  peerConnection.onsignalingstatechange = event => {
    console.log('Signaling state:', event, peerConnection.signalingState);
  };

  peerConnection.onicecandidateerror = event => {
    console.log('ICE candidate error:', event);
  };

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  const stopSharing = () => {
    if (isSharing && peerConnection) {
      setIsSharing(false);
      peerConnection.close();
      peerConnection = null!;
    }
  };

  useEffect(() => {
    socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      console.log('offer', offer);
      console.log('Offer SDP: ', offer.sdp);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      // Handle pending ICE candidates
      while (pendingCandidates.current.length > 0) {
        const iceCandidate = pendingCandidates.current.shift();
        if (iceCandidate) {
          try {
            if (peerConnection.remoteDescription) {
              await peerConnection.addIceCandidate(iceCandidate);
            }
          } catch (error) {
            console.error('Error adding queued ice candidate', error);
          }
        }
      }
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', peerConnection.localDescription);
    });

    socket.on('ice-candidate', (iceCandidateData: RTCIceCandidateInit) => {
      console.log('socket iceCandidate', iceCandidateData);
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

    // Receive stream and display it
    peerConnection.ontrack = function (event) {
      console.log('event', event.streams[0]);
      console.log('getTracks', event.streams[0].getTracks());
      // Check if the stream has valid video tracks
      const videoTracks = event.streams[0].getVideoTracks();
      console.log('Number of video tracks:', videoTracks.length);
      videoTracks.forEach(track => console.log('Track enabled:', track, track.enabled));

      setVideoStream(event.streams[0]);

      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0]; // assign the stream to the video element
        console.log('srcObject', videoRef.current.srcObject);
      }
    };

    peerConnection.oniceconnectionstatechange = function () {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === 'failed') {
        console.error('ICE connection failed.');
      }
    };

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        console.log('event.candidate', event.candidate);
        socket.emit('ice-candidate', event.candidate.toJSON());
      }
    };

    socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      console.log('Received answer:', peerConnection.signalingState, answer);
      if (peerConnection.signalingState !== 'stable') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [peerConnection, videoRef.current]);

  const startSharing = () => {
    if (!isSharing && iframeRef.current) {
      // Capture iframe content
      html2canvas(iframeRef.current.contentDocument?.body as HTMLElement).then(canvas => {
        console.log('canvas', canvas);
        // const stream = (canvas as any).captureStream(); // Convert canvas to stream
        const stream = (canvas as any).captureStream(30, { video: { mimeType: 'video/webm;codecs=vp9' } });

        console.log('stream', stream, stream.getTracks());

        // Add tracks to the peerConnection
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          if (track) {
            peerConnection.addTrack(track, stream);
          }
        });

        setIsSharing(true);

        // Sending our offer to the server on connection
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
      {videoStream && (
        <button
          onClick={() => {
            console.log('videoRef.current', videoRef.current, videoRef?.current?.srcObject);
            videoRef.current && videoRef.current.play();
          }}
        >
          Play video
        </button>
      )}
    </div>
  );
};

export default WebRTCStreamingCanvas;
