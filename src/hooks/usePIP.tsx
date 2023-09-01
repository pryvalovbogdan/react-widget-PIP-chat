import { toast } from 'react-toastify';

let pipWindow: any;

export const usePIP = (dispatchNotification: any) => {
  const openDocumentPIP = async () => {
    // Open a Picture-in-Picture window.
    // @ts-ignore
    pipWindow = await documentPictureInPicture.requestWindow();

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
        // @ts-ignore
        link.media = styleSheet.media;
        // @ts-ignore
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    });

    // Insert element into the Picture-in-Picture window.
    const wrapper = document.createElement('div');

    wrapper.className = 'toast-wrapper';
    pipWindow.document.body.appendChild(wrapper);
  };

  const addParticipantsMessage = (data: any) => {
    let message = '';
    if (data.numUsers === 1) {
      message += `there's 1 participant`;
    } else {
      message += `there are ${data.numUsers} participants`;
    }

    toast(message);
    console.log(message);

    dispatchNotification(message, pipWindow, 'JOIN');
  };

  return { pipWindow, openDocumentPIP, addParticipantsMessage };
};
