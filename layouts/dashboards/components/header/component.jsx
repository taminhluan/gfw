import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'next/link';
import { track } from 'analytics';

import { Loader } from 'gfw-components';

import Dropdown from 'components/ui/dropdown';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import DynamicSentence from 'components/ui/dynamic-sentence';
import AreaOfInterestModal from 'components/modals/area-of-interest';

import tagIcon from 'assets/icons/tag.svg?sprite';
import downloadIcon from 'assets/icons/download.svg?sprite';
import saveUserIcon from 'assets/icons/save-user.svg?sprite';
import subscribedIcon from 'assets/icons/subscribed.svg?sprite';
import pencilIcon from 'assets/icons/pencil.svg?sprite';
import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import './styles.scss';

class Header extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    locationNames: PropTypes.object.isRequired,
    adm0s: PropTypes.array,
    adm1s: PropTypes.array,
    adm2s: PropTypes.array,
    handleLocationChange: PropTypes.func.isRequired,
    setShareModal: PropTypes.func.isRequired,
    shareData: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    forestAtlasLink: PropTypes.object,
    sentence: PropTypes.object,
    downloadLink: PropTypes.string,
    selectorMeta: PropTypes.object,
    shareMeta: PropTypes.string,
    setAreaOfInterestModalSettings: PropTypes.func,
    title: PropTypes.string,
    activeArea: PropTypes.object,
    firstArea: PropTypes.object,
    errorMsg: PropTypes.string,
  };

  render() {
    const {
      className,
      adm0s,
      adm1s,
      adm2s,
      locationNames,
      handleLocationChange,
      loading,
      setShareModal,
      shareData,
      location,
      forestAtlasLink,
      sentence,
      downloadLink,
      selectorMeta,
      shareMeta,
      setAreaOfInterestModalSettings,
      title,
      activeArea,
      firstArea,
      errorMsg,
    } = this.props;
    const isCountryDashboard =
      location?.type === 'country' || location?.type === 'global';
    const isAreaDashboard = location?.type === 'aoi';
    const isAreaAndCountryDashboard =
      !isCountryDashboard &&
      activeArea &&
      activeArea.admin &&
      activeArea.admin.adm0;
    const showMetaControls =
      !loading && (!isAreaDashboard || (isAreaDashboard && activeArea));
    const { tags } = activeArea || {};

    return (
      <div className={cx('c-dashboards-header', className)}>
        {loading && <Loader className="loader" light />}
        {showMetaControls && (
          <div className="share-buttons">
            <Button
              className="theme-button-small"
              onClick={() => {
                if (activeArea && !activeArea.userArea) {
                  setAreaOfInterestModalSettings({ open: true });
                } else {
                  setShareModal(shareData);
                }
              }}
            >
              {shareMeta}
            </Button>
            {activeArea && activeArea.userArea && (
              <Button
                className="theme-button-medium theme-button-clear square"
                tooltip={{
                  text: `Edit ${
                    locationNames &&
                    locationNames.adm0 &&
                    locationNames.adm0.label
                  }`,
                  position: 'bottom',
                }}
                onClick={() => setAreaOfInterestModalSettings({ open: true })}
              >
                <Icon icon={pencilIcon} />
              </Button>
            )}
            {location?.type === 'country' && (
              <Button
                className="theme-button-medium theme-button-clear square"
                tooltip={{
                  text: 'Save as an area of interest',
                  position: 'bottom',
                }}
                onClick={() => setAreaOfInterestModalSettings({ open: true })}
              >
                <Icon icon={saveUserIcon} />
              </Button>
            )}
            {(isCountryDashboard || isAreaAndCountryDashboard) && (
              <Button
                className="c-dashboard-download-btn theme-button-medium theme-button-clear square"
                extLink={downloadLink}
                tooltip={{
                  text: `Download the data${
                    locationNames.adm0
                      ? ` for ${
                          locationNames &&
                          locationNames.adm0 &&
                          locationNames.adm0.label
                        }`
                      : ''
                  }`,
                  position: 'bottom',
                }}
                onClick={() => {
                  track('downloadDashboardPage', {
                    label:
                      (locationNames &&
                        locationNames.adm0 &&
                        locationNames.adm0.label) ||
                      'Global',
                  });
                }}
              >
                <Icon icon={downloadIcon} />
              </Button>
            )}
          </div>
        )}
        <div className="row">
          <div className="columns small-12 medium-10">
            <div className="select-container">
              {isAreaDashboard && (
                <Link href="/dashboards/[...location]" as="/dashboards/global">
                  <a className="breadcrumb-link">
                    <button
                      onClick={() =>
                        track('switchDashboardType', {
                          label: 'changes to global',
                        })}
                    >
                      <Icon icon={arrowIcon} className="breadcrumb-icon" />
                      Go to Global dashboard
                    </button>
                  </a>
                </Link>
              )}
              {isCountryDashboard && !!firstArea && (
                <Link
                  href="/dashboards/[...location]"
                  as={`/dashboards/aoi/${firstArea.id}`}
                >
                  <a className="breadcrumb-link">
                    <button
                      onClick={() =>
                        track('switchDashboardType', {
                          label: 'changes to areas',
                        })}
                    >
                      <Icon icon={arrowIcon} className="breadcrumb-icon" />
                      Go to Areas dashboard
                    </button>
                  </a>
                </Link>
              )}
              {title && (
                <h3 className={cx({ global: title === 'global' })}>{title}</h3>
              )}
              {isAreaDashboard && !activeArea && !loading && (
                <h3>{errorMsg}</h3>
              )}
              {adm0s && (
                <Dropdown
                  theme="theme-dropdown-dark"
                  placeholder={`Select ${selectorMeta.typeVerb}`}
                  noItemsFound={`No ${selectorMeta.typeName} found`}
                  noSelectedValue={`Select ${selectorMeta.typeName}`}
                  value={locationNames.adm0}
                  options={adm0s}
                  onChange={(adm0) =>
                    handleLocationChange({ adm0: adm0 && adm0.value })}
                  searchable
                  disabled={loading}
                  tooltip={{
                    text: `Choose the ${selectorMeta.typeName} you want to explore`,
                    delay: 1000,
                  }}
                  arrowPosition="left"
                  clearable={isCountryDashboard}
                />
              )}
              {isCountryDashboard &&
                location.adm0 &&
                adm0s &&
                adm1s &&
                adm1s.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Select a region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
                    value={locationNames.adm1}
                    options={adm1s}
                    onChange={(adm1) =>
                      handleLocationChange({
                        adm0: location.adm0,
                        adm1: adm1 && adm1.value,
                      })}
                    searchable
                    disabled={loading}
                    tooltip={{
                      text: 'Choose the region you want to explore',
                      delay: 1000,
                    }}
                    arrowPosition="left"
                    clearable
                  />
                )}
              {isCountryDashboard &&
                location.adm1 &&
                adm1s &&
                adm2s &&
                adm2s.length > 1 && (
                  <Dropdown
                    theme="theme-dropdown-dark"
                    placeholder="Select a region"
                    noItemsFound="No region found"
                    noSelectedValue="Select a region"
                    value={locationNames.adm2}
                    options={adm2s}
                    onChange={(adm2) =>
                      handleLocationChange({
                        adm0: location.adm0,
                        adm1: location.adm1,
                        adm2: adm2 && adm2.value,
                      })}
                    searchable
                    disabled={loading}
                    tooltip={{
                      text: 'Choose the region you want to explore',
                      delay: 1000,
                    }}
                    arrowPosition="left"
                    clearable
                  />
                )}
            </div>
          </div>
          {!loading && activeArea && activeArea.userArea && (
            <div className="columns small-12 medium-10">
              <div className="metadata">
                {tags && !!tags.length && (
                  <div className="tags">
                    <Icon icon={tagIcon} className="tag-icon" />
                    <p>{tags.join(', ')}</p>
                  </div>
                )}
                {(activeArea.deforestationAlerts ||
                  activeArea.monthlySummary ||
                  activeArea.fireAlerts) && (
                  <div className="subscribed">
                    <Icon icon={subscribedIcon} className="subscribed-icon" />
                    <p>Subscribed</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="columns small-12 medium-10">
            <div className="description text -title-xs">
              {!loading && (
                <div>
                  <DynamicSentence className="sentence" sentence={sentence} />
                  {location && location.adm0 === 'IDN' && (
                    <Fragment>
                      <p className="disclaimer">
                        *Primary forest is defined as mature natural humid
                        tropical forest that has not been completely cleared and
                        regrown in recent history.
                      </p>
                    </Fragment>
                  )}
                  {forestAtlasLink && isCountryDashboard && (
                    <Button
                      className="forest-atlas-btn"
                      extLink={forestAtlasLink.url}
                    >
                      EXPLORE FOREST ATLAS
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <AreaOfInterestModal viewAfterSave />
      </div>
    );
  }
}

export default Header;
