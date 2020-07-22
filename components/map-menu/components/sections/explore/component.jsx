import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { track } from 'analytics';
import ReactHtmlParser from 'react-html-parser';

import { Loader } from 'gfw-components';

import SubnavMenu from 'components/subnav-menu';
import Dropdown from 'components/ui/dropdown';
import Card from 'components/ui/card';
import PTWProvider from 'providers/ptw-provider';

import './styles.scss';

class Explore extends PureComponent {
  render() {
    const {
      section,
      data,
      setMenuSettings,
      handleViewOnMap,
      description,
      mapState,
      loading,
      ptwType,
      setMapPromptsSettings
    } = this.props;
    const links = [
      {
        label: 'Forest Topics',
        active: section === 'topics',
        onClick: () => {
          setMenuSettings({ exploreType: 'topics' });
          track('mapMenuExploreCategory', { label: 'Topics' });
        }
      },
      {
        label: 'Places to Watch',
        active: section === 'placesToWatch',
        onClick: () => {
          setMenuSettings({ exploreType: 'placesToWatch' });
          track('mapMenuExploreCategory', { label: 'Places to watch' });
        }
      },
      {
        label: 'Stories',
        active: section === 'stories',
        onClick: () => {
          setMenuSettings({ exploreType: 'stories' });
          track('mapMenuExploreCategory', { label: 'Stories' });
        }
      }
    ];

    return (
      <div className="c-explore">
        <SubnavMenu
          links={links}
          className="explore-menu"
          theme="theme-subnav-small-light"
        />
        <div className="content">
          <div className="row">
            <div className="column small-12">
              <div className="description">
                {section === 'placesToWatch' ? (
                  <Fragment>
                    <p>{ReactHtmlParser(description)}</p>
                    <p className="ptw-type-intro">Showing information about</p>
                    <Dropdown
                      className="ptw-type-selector"
                      theme="theme-dropdown-native-button"
                      value={ptwType}
                      options={[
                        {
                          label: 'All Places to Watch',
                          value: 'all'
                        },
                        {
                          label: 'Mongabay reporting',
                          value: 'mongabay'
                        },
                        {
                          label: 'Soy',
                          value: 'soy'
                        },
                        {
                          label: 'Oil palm',
                          value: 'palm'
                        }
                      ]}
                      onChange={value => setMenuSettings({ ptwType: value })}
                      native
                    />
                    <PTWProvider />
                  </Fragment>
                ) : (
                  <p>{description}</p>
                )}
              </div>
            </div>
            {!loading &&
              data &&
              data.map(item => (
                <div
                  key={item.slug || item.id}
                  className="column small-12 medium-6"
                >
                  <Card
                    className="map-card"
                    theme="theme-card-small"
                    clamp={5}
                    data={{
                      ...item,
                      buttons: item.buttons.map(b => ({
                        ...b,
                        ...(b.text === 'VIEW ON MAP' && {
                          onClick: () => {
                            handleViewOnMap({ ...item.payload });
                            setMapPromptsSettings({
                              open: true,
                              stepIndex: 0,
                              stepsKey: `topics${item.title}`
                            });
                            track('mapMenuAddTopic', { label: item.title });
                          }
                        })
                      }))
                    }}
                    active={isEqual(item.payload.map, mapState)}
                  />
                </div>
              ))}
            {loading && <Loader />}
          </div>
        </div>
      </div>
    );
  }
}

Explore.propTypes = {
  section: PropTypes.string,
  data: PropTypes.array,
  setMenuSettings: PropTypes.func,
  description: PropTypes.string,
  mapState: PropTypes.object,
  loading: PropTypes.bool,
  handleViewOnMap: PropTypes.func,
  ptwType: PropTypes.string,
  setMapPromptsSettings: PropTypes.func
};

export default Explore;
