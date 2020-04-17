/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Tooltip } from 'react-tippy';
import Tip from 'components/tip';

import './styles.scss';
import './themes/light.scss';
import './themes/dark.scss';
import './themes/clear.scss';

class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    theme: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    tooltip: PropTypes.object,
    ariaLabel: PropTypes.string
  };

  renderButton = () => {
    const {
      children,
      className,
      theme,
      disabled,
      onClick,
      ariaLabel
    } = this.props;

    return (
      <button
        // className={cx('c-button', theme, className, { disabled })}
        css={css`
          height: 40px;
          border-radius: 20px;
          padding: 0 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: green;
          font-size: 14px;
          text-transform: uppercase;
          text-align: center;
          line-height: 14px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          transition: background-color 150ms ease-out;
          width: fit-content;

          &:hover {
            background-color: green;
            text-decoration: none;
          }

          &:focus {
            outline: none;
          }
        `}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <div
          css={css`
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 1px;
            font-weight: inherit;

            svg {
              fill: #fff;
              width: 15px;
              height: 15px;
            }
          `}
        >
          {children}
        </div>
      </button>
    );
  };

  render() {
    const { tooltip } = this.props;

    return tooltip
      ? (
        <Tooltip
          theme="tip"
          position="top"
          arrow
          html={<Tip text={tooltip.text} />}
        >
          {this.renderButton()}
        </Tooltip>
)
      : this.renderButton();
  }
}

export default Button;
