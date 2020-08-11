import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import useRouter from 'utils/router';

const Link = ({ children, as, href, ...props }) => {
  const { query } = useRouter();
  const { lang } = query || {};
  const i18nHref = lang ? `/${lang}${href}` : href;
  const i18nAs = lang ? `/${lang}${as}` : as;

  return (
    <NextLink {...props} href={i18nHref} as={as && i18nAs}>
      {children}
    </NextLink>
  );
};

Link.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  as: PropTypes.string,
};

export default Link;
