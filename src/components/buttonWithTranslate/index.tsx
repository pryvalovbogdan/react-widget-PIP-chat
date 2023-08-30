import { useTranslation } from 'react-i18next';
import { IButtonWithTranslateProps } from './types.ts';

export const ButtonWithTranslate = ({ i18Key, handle, i18Value, backgroundColor }: IButtonWithTranslateProps) => {
  const { t } = useTranslation();

  return (
    <button style={{ backgroundColor }} onClick={handle}>
      {t(i18Key, { [i18Key]: i18Value })}
    </button>
  );
};
