import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { track } from 'analytics';

import { Loader, NoContent } from 'gfw-components';

import Widget from 'components/widget';

import './styles.scss';

class Widgets extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loadingData: PropTypes.bool,
    loadingMeta: PropTypes.bool,
    widgets: PropTypes.array,
    widgetsData: PropTypes.object,
    simple: PropTypes.bool,
    location: PropTypes.object,
    locationObj: PropTypes.object,
    locationData: PropTypes.object,
    setWidgetsData: PropTypes.func.isRequired,
    setWidgetSettings: PropTypes.func.isRequired,
    setActiveWidget: PropTypes.func.isRequired,
    setModalMetaSettings: PropTypes.func.isRequired,
    setShareModal: PropTypes.func.isRequired,
    setMapSettings: PropTypes.func.isRequired,
    handleClickWidget: PropTypes.func.isRequired,
    embed: PropTypes.bool,
    modalClosing: PropTypes.bool,
    activeWidget: PropTypes.object,
    noDataMessage: PropTypes.string,
    geostore: PropTypes.object,
  };

  render() {
    const {
      activeWidget,
      className,
      widgets,
      location,
      loadingData,
      loadingMeta,
      setWidgetsData,
      setWidgetSettings,
      setActiveWidget,
      setModalMetaSettings,
      setShareModal,
      embed,
      simple,
      modalClosing,
      noDataMessage,
      geostore,
      handleClickWidget,
    } = this.props;
    const hasWidgets = !isEmpty(widgets);

    return (
      <div
        className={cx(
          'c-widgets',
          className,
          { simple: this.props.simple },
          { 'no-widgets': !hasWidgets }
        )}
      >
        {loadingData && <Loader className="widgets-loader large" />}
        {!loadingData &&
          widgets &&
          widgets.map((w) => (
            <Widget
              key={w.widget}
              {...w}
              large={w.large}
              active={activeWidget && activeWidget.widget === w.widget}
              embed={embed}
              simple={simple}
              location={location}
              geostore={geostore}
              metaLoading={loadingMeta || loadingData}
              setWidgetData={(data) => setWidgetsData({ [w.widget]: data })}
              handleChangeSettings={(change) =>
                setWidgetSettings({
                  widget: w.widget,
                  change: {
                    ...change,
                    ...(change.forestType === 'ifl' &&
                      w.settings &&
                      w.settings.extentYear && {
                        extentYear: w.settings.ifl === '2016' ? 2010 : 2000,
                      }),
                    ...(change.forestType === 'primary_forest' &&
                      w.settings &&
                      w.settings.extentYear && {
                        extentYear: 2000,
                      }),
                  },
                })}
              handleShowMap={() => {
                setActiveWidget(w.widget);
                track('viewWidgetOnMap', {
                  label: w.widget,
                });
              }}
              handleShowInfo={setModalMetaSettings}
              handleShowShare={() =>
                setShareModal({
                  title: 'Share this widget',
                  shareUrl: w.shareUrl,
                  embedUrl: w.embedUrl,
                  embedSettings: !w.large
                    ? { width: 315, height: 460 }
                    : { width: 630, height: 460 },
                })}
              preventCloseSettings={modalClosing}
              onClickWidget={handleClickWidget}
            />
          ))}
        {!loadingData && !hasWidgets && !simple && (
          <NoContent
            className="no-widgets-message large"
            message={noDataMessage}
            icon
          />
        )}
      </div>
    );
  }
}

export default Widgets;
