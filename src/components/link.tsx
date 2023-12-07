/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react';
import NextLink from 'next/link';
import clsx from 'clsx';
import PropTypes from 'prop-types';

interface Styles {
  base: string;
  size: {
    xl?: string;
    lg?: string;
    md?: string;
    sm?: string;
    xs?: string;
  };
  theme: {
    [key: string]: string;
  };
}

const styles: Styles = {
  base: '',
  size: {
    xl: '',
    lg: '',
    md: '',
    sm: '',
    xs: '',
  },
  theme: {},
};

interface LinkProps {
  className?: string;
  to?: string;
  size?: keyof Styles['size'] | null;
  theme?: keyof Styles['theme'] | null;
  children: React.ReactNode;
}

const Link: FC<LinkProps> = ({
  className: additionalClassName,
  size,
  theme,
  to,
  children,
  ...props
}) => {
  const classList = clsx(
    size && theme && styles.base,
    size && styles.size[size],
    theme && styles.theme[theme],
    additionalClassName
  );

  if (to && to.startsWith('/')) {
    return (
      <NextLink href={to} {...props}>
        <a className={classList}>{children}</a>
      </NextLink>
    );
  }

  return (
    <a href={to} {...props} className={classList}>
      {children}
    </a>
  );
};

Link.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  size: PropTypes.oneOf<keyof Styles['size']>(
    Object.keys(styles.size) as (keyof Styles['size'])[]
  ),
  theme: PropTypes.oneOf<keyof Styles['theme']>(
    Object.keys(styles.theme) as (keyof Styles['theme'])[]
  ),
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  className: 'string' || null,
  to: 'string' || null,
  size: null,
  theme: null,
};

export default Link;
