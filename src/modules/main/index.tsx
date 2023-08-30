import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonWithTranslate } from '../../components/buttonWithTranslate';

const Main = () => {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('react')}</h1>
      <div className='card'>
        <ButtonWithTranslate i18Key='count' handle={() => setCount(count => count + 1)} i18Value={count} />
      </div>
    </>
  );
};

export default Main;
