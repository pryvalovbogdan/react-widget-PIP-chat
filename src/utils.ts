let isLeft = true;

const getBackGround = (type?: string) => {
  switch (type) {
    case 'JOIN':
      return 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(252,176,69,1) 100%)';
    case 'LEAVE':
      return 'linear-gradient(90deg, rgba(58,0,255,1) 0%, rgba(0,255,179,1) 100%)';
    default:
      return 'linear-gradient(135deg, #73a5ff, #5477f5)';
  }
};

export function dispatchNotification(text: string, pipWindow?: any, type?: string) {
  const wrapper = pipWindow?.document.body.querySelector('.toast-wrapper');
  const message = document.createElement('div');

  message.className = 'toast';
  message.innerHTML = `<span>${text}</span>`;
  message.style.marginLeft = isLeft ? '20px' : '120px';
  message.style.background = getBackGround(type);
  isLeft = !isLeft;

  if (wrapper) {
    wrapper.appendChild(message);
    pipWindow.document.body.scrollTop = wrapper.scrollHeight;
  }
}
