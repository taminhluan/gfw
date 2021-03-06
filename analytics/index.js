import ReactGA from 'react-ga';
import ReactPixel from 'utils/facebook-pixel';
import TwitterConvTrkr from 'react-twitter-conversion-tracker';

import { decodeUrlForState } from 'utils/stateToUrl';
import mapEvents from 'analytics/map';
import sharedEvents from 'analytics/shared';
import dashboardsEvents from 'analytics/dashboards';
import topicsEvents from 'analytics/topics';

const IS_BROWSER = typeof window !== 'undefined';

export const initAnalytics = () => {
  if (IS_BROWSER) {
    ReactGA.initialize(process.env.ANALYTICS_PROPERTY_ID);
    ReactPixel.init(process.env.FACEBOOK_PIXEL_ID);
    TwitterConvTrkr.init(process.env.TWITTER_CONVERSION_ID);
  }
};

const events = {
  ...mapEvents,
  ...dashboardsEvents,
  ...sharedEvents,
  ...topicsEvents,
};

export const handlePageTrack = () => {
  const url = `${window.location.pathname}${window.location.search}`;
  ReactGA.set({ page: url });
  ReactGA.pageview(url);
  ReactPixel.pageView();
  TwitterConvTrkr.pageView();
};

export const handleMapLatLonTrack = (location) => {
  const { query } = location || {};
  const { map } = query || {};
  const position =
    map && `/location/${map.center.lat}/${map.center.lng}/${map.zoom}`;
  if (position) {
    ReactGA.pageview(
      `${position}${window.location.pathname}?${JSON.stringify(
        decodeUrlForState(window.location.search)
      )}`
    );
  }
};

export const track = (key, data) =>
  events[key] && ReactGA.event({ ...events[key], ...data });
