const googleLangCode = {
  es_MX: 'es',
  en: 'en',
  zh: 'zh-CH',
  pt_BR: 'pt',
  fr: 'fr',
  id: 'id',
};

const momentLangCode = {
  es_MX: 'es',
  en: 'en',
  zh: 'zh-cn',
  pt_BR: 'pt-br',
  fr: 'fr',
  id: 'id',
};

const isServer = typeof window === 'undefined';

export const getLanguages = () => {
  const txData =
    !isServer && JSON.parse(localStorage.getItem('txlive:languages'));
  return (
    txData &&
    txData.source &&
    [txData.source].concat(txData.translation).map((l) => ({
      label: l.name,
      value: l.code,
    }))
  );
};

export const getGoogleLangCode = (lang) => googleLangCode[lang || 'en'];
export const getMomentLangCode = (lang) => momentLangCode[lang || 'en'];

export const getLangPathname = (
  pathname,
  as,
  currentLang = 'en',
  targetLang
) => {
  let path = pathname;
  let asPath = as;
  console.log('get new path', pathname, as, currentLang, targetLang);
  if (currentLang === 'en' && pathname === '/') {
    path = `/[lang]`;
    asPath = `/${targetLang}/`;
  } else if (targetLang === 'en' && pathname === `/[lang]`) {
    path = '/';
    asPath = '/';
  } else if (targetLang === 'en') {
    path = pathname.replace('/[lang]', '');
    asPath = as.replace(`/${currentLang}`, '');
  } else if (currentLang === 'en' && targetLang !== 'en') {
    path = `/[lang]${pathname}`;
    asPath = `/${targetLang}${as}`;
  } else {
    asPath = as.replace(`/${currentLang}/`, `/${targetLang}/`);
  }

  return {
    pathname: path,
    as: asPath,
  };
};
