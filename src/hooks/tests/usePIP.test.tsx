import { renderHook, act } from '@testing-library/react';

import { usePIP } from '../usePIP';
import { dispatchNotification } from 'src/utils.ts';

jest.mock('../../utils.ts', () => ({
  dispatchNotification: jest.fn(),
}));

const elem = document.createElement('div');

window.documentPictureInPicture = {
  requestWindow: () => elem,
};

describe('usePIP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with isPIPOpen as false', () => {
    const { result } = renderHook(() => usePIP([]));

    expect(result.current.isPIPOpen).toBe(false);
  });

  it('should open the PIP window when calling openDocumentPIP', async () => {
    const { result } = renderHook(() => usePIP([]));

    await act(async () => {
      await result.current.openDocumentPIP();
    });

    expect(result.current.isPIPOpen).toBe(true);
  });

  it('should add participants message', async () => {
    const { result } = renderHook(() => usePIP([]));

    await act(async () => {
      await result.current.addParticipantsMessage({ numUsers: 1 });
    });

    expect(dispatchNotification).toBeCalledWith('thereOneParticipant', elem, 'JOIN');
  });

  it('should add several participants message', async () => {
    const { result } = renderHook(() => usePIP([]));

    await act(async () => {
      await result.current.addParticipantsMessage({ numUsers: 3 });
    });

    expect(dispatchNotification).toBeCalledWith('there are 3 participants', elem, 'JOIN');
  });

  it('should dispatch notification with hey and yo message', async () => {
    const { result } = renderHook(() => usePIP(['hey', 'yo']));

    await act(async () => {
      await result.current.openDocumentPIP();
    });

    expect(dispatchNotification).toBeCalledWith('hey', elem);
    expect(dispatchNotification).toBeCalledWith('yo', elem);
  });
});
