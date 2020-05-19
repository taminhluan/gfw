import React, { PureComponent } from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { formatNumber } from 'utils/format';

import './lollipop-chart-styles.scss';

class LollipopChart extends PureComponent {
  render() {
    const {
      className,
      data,
      settings,
      settingsConfig,
      linksDisabled,
      linksExt
    } = this.props;
    const { unit } = settings;

    const unitsConfig = settingsConfig.find(conf => conf.key === 'unit');
    const selectedUnitConfig =
      unitsConfig &&
      unitsConfig.options &&
      unitsConfig.options.find(opt => opt.value === unit);
    let formatUnit = unit;
    if (selectedUnitConfig) {
      formatUnit =
        selectedUnitConfig.unit !== undefined
          ? selectedUnitConfig.unit
          : selectedUnitConfig.value;
    }

    let dataMax =
      data && data.reduce((acc, item) => Math.max(acc, item.value), 0);
    let dataMin =
      data && data.reduce((acc, item) => Math.min(acc, item.value), 0);
    dataMax = dataMax && dataMax > 0 ? dataMax : 0;
    dataMin = dataMin && dataMin < 0 ? dataMin : 0;
    const interpolate = num =>
      Math.abs(num) * 100 / (dataMax + Math.abs(dataMin) || 1);

    return (
      <div className={cx('c-lollipop-chart', className)}>
        <div className="unit-legend">{`${unit
          .charAt(0)
          .toUpperCase()}${unit.slice(1)} (${formatUnit})`}</div>
        <ul className="list">
          {data.length > 0 &&
            data.map((item, index) => {
              const isNegative = item.value < 0;
              const linkContent = (
                <div className="list-item">
                  <div className="item-label">
                    <div className="item-bubble">{item.rank || index + 1}</div>
                    <div className="item-name">{item.label}</div>
                  </div>
                  <div
                    className="item-lollipop-bar"
                    style={isNegative ? { flexDirection: 'row-reverse' } : {}}
                  >
                    <div
                      className="item-spacer"
                      style={{
                        width: `${interpolate(
                          Math.abs(isNegative ? dataMax : dataMin)
                        )}%`
                      }}
                    />
                    <div
                      className="lollipop"
                      style={{
                        width: `calc(${interpolate(
                          Math.abs(item.value)
                        )}% - 67px)`
                        // 100% max - 35px (value text) - 32px text margin
                      }}
                    >
                      <div
                        className="item-bar"
                        style={{
                          backgroundColor: item.color
                        }}
                      />
                      <div
                        className="item-bubble -lollipop"
                        style={{
                          backgroundColor: item.color,
                          transform: `translateX(${
                            isNegative ? '-8px' : '8px'
                          })`,
                          [isNegative ? 'left' : 'right']: 0
                        }}
                      />
                    </div>
                    <div className="item-value">
                      {formatNumber({
                        num: item.value,
                        unit: item.unit || formatUnit
                      })}
                    </div>
                  </div>
                </div>
              );
              return (
                <li key={`${item.label}-${item.id}`}>
                  {item.path &&
                    linksExt && (
                    <a
                      href={`https://${window.location.host}${item.path}`}
                      target="_blank"
                      rel="noopener nofollower"
                    >
                      {linkContent}
                    </a>
                  )}
                  {item.path &&
                    !linksExt && (
                    <Link
                      className={`${linksDisabled ? 'disabled' : ''}`}
                      to={item.path}
                    >
                      {linkContent}
                    </Link>
                  )}
                  {!item.path && (
                    <div className={`${linksDisabled ? 'disabled' : ''}`}>
                      {linkContent}
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

LollipopChart.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  className: PropTypes.string,
  linksDisabled: PropTypes.bool,
  linksExt: PropTypes.bool
};

export default LollipopChart;
