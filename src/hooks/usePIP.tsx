import { toast } from 'react-toastify';
import { useState } from 'react';

import i18next from '@i18n/i18next.ts';
import { dispatchNotification } from '../utils.ts';

let pipWindow: any;

export const usePIP = (messages: string[]) => {
  const [isPIPOpen, setIsPIPOpen] = useState<boolean>(false);

  const openDocumentPIP = async () => {
    setIsPIPOpen(true);
    // Open a Picture-in-Picture window.
    pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 500,
      height: 500,
    });

    // Handle closing PIP window
    pipWindow.addEventListener('pagehide', () => {
      setIsPIPOpen(false);
    });

    // Copy style sheets over from the initial document
    // so that the player looks the same.
    [...document.styleSheets].forEach(styleSheet => {
      try {
        const cssRules = [...styleSheet.cssRules].map(rule => rule.cssText).join('');
        const style = document.createElement('style');

        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = styleSheet.type;
        link.media = styleSheet.media as unknown as string;
        link.href = styleSheet.href as unknown as string;
        pipWindow.document.head.appendChild(link);
      }
    });

    // Creating wrapper for chat
    const wrapper = document.createElement('div');
    wrapper.className = 'toast-wrapper';

    // Insert element into the Picture-in-Picture window.
    pipWindow.document.body.appendChild(wrapper);

    messages.forEach(item => dispatchNotification(item, pipWindow));
  };

  const addParticipantsMessage = (data: { numUsers: number }) => {
    let message = '';
    if (data.numUsers === 1) {
      message += i18next.t('thereOneParticipant');
    } else {
      message += i18next.t('thereAreParticipants', { numUsers: data.numUsers });
    }

    toast(message);
    dispatchNotification(message, pipWindow, 'JOIN');
  };

  return { pipWindow, openDocumentPIP, addParticipantsMessage, isPIPOpen };
};
