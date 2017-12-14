import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetSettings from 'pages/country/widget/components/widget-settings';
import './widget-fao-extent-styles.scss';

class WidgetFAOExtent extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      periods,
      settings,
      getSentence,
      setFAOExtentSettingsPeriod
    } = this.props;

    return (
      <div className="c-widget c-widget-fao-extent">
        <WidgetHeader title={'FAO REFORESTATION'} shareAnchor={'fao-extent'}>
          <WidgetSettings
            type="settings"
            periods={periods}
            settings={settings}
            onPeriodChange={setFAOExtentSettingsPeriod}
            isLoading={isLoading}
            locationNames={locationNames}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div
            className="sentence"
            dangerouslySetInnerHTML={getSentence()} // eslint-disable-line
          />
        )}
      </div>
    );
  }
}

WidgetFAOExtent.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  periods: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired,
  setFAOExtentSettingsPeriod: PropTypes.func.isRequired
};

export default WidgetFAOExtent;
