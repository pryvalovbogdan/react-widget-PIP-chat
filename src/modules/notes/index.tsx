import { useTranslation } from 'react-i18next';

const Notes = () => {
  const { t } = useTranslation();

  return <div>{t('notes')}</div>;
};

export default Notes;
