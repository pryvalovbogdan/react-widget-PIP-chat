import { toast } from 'react-toastify';
import i18next from '@i18n/i18next.ts';

let pipWindow: any;

export const usePIP = (dispatchNotification: any) => {
  const openDocumentPIP = async () => {
    // Open a Picture-in-Picture window.
    pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 500,
      height: 500,
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

    // Insert element into the Picture-in-Picture window.
    const wrapper = document.createElement('div');

    wrapper.className = 'toast-wrapper';
    pipWindow.document.body.appendChild(wrapper);
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

  return { pipWindow, openDocumentPIP, addParticipantsMessage };
};
