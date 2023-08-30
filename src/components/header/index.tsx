import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { i18n, t } = useTranslation('header');
  const navigate = useNavigate();

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      // In case nested routes there could be rerender and to save route after rerender with i18
      navigate(location.pathname);
    });
  };
  const allLanguages = ['en', 'de', 'es'];
  const selectedLanguage = i18n.language;

  return (
    <div>
      {t('lang')}:
      <span style={{ marginLeft: '10px', gap: '5px', display: 'inline-flex' }}>
        {allLanguages.map(item => (
          <button key={item} disabled={item === selectedLanguage} onClick={() => changeLanguageHandler(item)}>
            {item}
          </button>
        ))}
      </span>
    </div>
  );
};
