import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { track } from 'analytics';

import { Media } from 'utils/responsive';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg?sprite';
import './styles.scss';

class Intro extends PureComponent {
  render() {
    const { intro, className, handleSkipToTools } = this.props;
    const { img1x, img2x, title, text, citation, button } = intro;

    return (
      <div className={cx('c-topics-intro', className)}>
        <div className="row titleRow">
          <div className="column small-12 medium-6 titleCol">
            <Media greaterThanOrEqual="md">
              <div className="intro-img">
                <img
                  {...(img2x && {
                    srcSet: `${img2x} 2x, ${img1x} 1x,`,
                    src: `${img1x} 1x`,
                  })}
                  {...(!img2x && {
                    src: img1x,
                  })}
                  alt={title}
                />
              </div>
            </Media>
          </div>
          <div className="column small-12 medium-6 titleCol">
            <h1 className="intro-title">{title}</h1>
            {citation && (
              <a
                className="citation-link"
                href={citation}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track('topicsCitation', {
                    label: title,
                  });
                }}
              >
                <Icon className="citation-icon" icon={infoIcon} />
              </a>
            )}
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-6" />
          <div className="column small-12 medium-6">
            <p className="intro-text">{text}</p>
            <div className="intro-buttons">
              {button && (
                <Button theme="intro-btn" link={button.link}>
                  {button.text}
                </Button>
              )}
              <Media greaterThanOrEqual="md">
                <Button
                  theme="theme-button-light skip-to-tools"
                  onClick={handleSkipToTools}
                >
                  Related tools
                </Button>
              </Media>
            </div>
          </div>
        </div>
        <Media lessThan="md">
          <div className="intro-img">
            <img
              {...(img2x && {
                srcSet: `${img2x} 2x, ${img1x} 1x,`,
                src: `${img1x} 1x`,
              })}
              {...(!img2x && {
                src: img1x,
              })}
              alt={title}
            />
          </div>
        </Media>
      </div>
    );
  }
}

Intro.propTypes = {
  intro: PropTypes.object,
  className: PropTypes.string,
  handleSkipToTools: PropTypes.func,
};

export default Intro;
