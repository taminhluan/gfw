/* eslint-disable no-undef */

import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getPolygonCenter } from 'utils/map';

import actions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import {
  getAllTiles,
  getTile,
  getBounds,
  getSources,
  getDates
} from './recent-imagery-selectors';
import RecentImageryDrag from './recent-imagery-drag';
import RecentImageryComponent from './recent-imagery-component';

const mapStateToProps = ({ recentImagery }) => {
  const { active, showSettings, data, dataStatus, settings } = recentImagery;
  const selectorData = {
    data: data.tiles,
    bbox: data.bbox,
    dataStatus,
    settings
  };
  return {
    active,
    showSettings,
    dataStatus,
    allTiles: getAllTiles(selectorData),
    tile: getTile(selectorData),
    bounds: getBounds(selectorData),
    sources: getSources(selectorData),
    dates: getDates(selectorData),
    settings
  };
};

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    this.middleView = window.App.Views.ReactMapMiddleView;
    this.boundsPolygon = null;
    this.boundsPolygonInfowindow = null;
    this.activatedFromUrl = false;
    this.removedFromUrl = false;
    window.addEventListener('isRecentImageryActivated', () => {
      const { active, toogleRecentImagery } = this.props;
      if (!active) {
        this.activatedFromUrl = true;
        toogleRecentImagery();
      }
    });
    window.addEventListener('removeLayer', e => {
      const { active, toogleRecentImagery } = this.props;
      if (e.detail === 'sentinel_tiles' && active) {
        this.removedFromUrl = true;
        toogleRecentImagery();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      active,
      showSettings,
      dataStatus,
      tile,
      bounds,
      sources,
      dates,
      settings,
      getData,
      getMoreTiles
    } = nextProps;
    const { map } = this.middleView;
    const isNewTile =
      tile && (!this.props.tile || tile.url !== this.props.tile.url);

    if (
      (active && active !== this.props.active) ||
      !isEqual(settings.date, this.props.settings.date) ||
      !isEqual(settings.weeks, this.props.settings.weeks)
    ) {
      getData({
        latitude: map.getCenter().lng(),
        longitude: map.getCenter().lat(),
        start: dates.start,
        end: dates.end
      });
    }
    if (!active && active !== this.props.active) {
      this.removeLayer();
      this.removeEvents();
      this.removeBoundsPolygon();
    }
    if (isNewTile) {
      if (this.activatedFromUrl && !this.props.tile) {
        this.updateLayer(tile.url);
        this.setEvents();
      } else if (!this.props.tile) {
        this.showLayer(tile.url);
        this.setEvents();
      } else {
        this.updateLayer(tile.url);
      }
      this.addBoundsPolygon(bounds, tile);
    }
    if (
      !dataStatus.haveAllData &&
      showSettings &&
      (showSettings !== this.props.showSettings ||
        dataStatus.requestedTiles !== this.props.dataStatus.requestedTiles ||
        dataStatus.requestFails !== this.props.dataStatus.requestFails ||
        isNewTile)
    ) {
      getMoreTiles({ sources, dataStatus });
    }
  }

  setEvents() {
    const { map } = this.middleView;

    const loadNewTile = () => {
      const { dates, getData } = this.props;
      const zoom = map.getZoom();
      const needNewTile = !google.maps.geometry.poly.containsLocation(
        map.getCenter(),
        this.boundsPolygon
      );
      if (needNewTile) {
        getData({
          latitude: map.getCenter().lng(),
          longitude: map.getCenter().lat(),
          start: dates.start,
          end: dates.end
        });
      }
      if (zoom >= 10) {
        this.boundsPolygon.setOptions({
          fillColor: 'transparent',
          strokeWeight: 0
        });
        this.boundsPolygonInfowindow.close();
      }
    };
    this.mapDragEvent = map.addListener('dragend', loadNewTile);
    this.mapZoomEvent = map.addListener('zoom_changed', loadNewTile);
  }

  removeEvents() {
    google.maps.event.removeListener(this.mapDragEvent);
    google.maps.event.removeListener(this.mapZoomEvent);
  }

  showLayer(url) {
    const { map } = this.middleView;
    const { settings: { layerSlug, minZoom } } = this.props;
    const zoom = map.getZoom();

    this.middleView.toggleLayer(layerSlug, {
      urlTemplate: url
    });
    if (zoom < minZoom) {
      map.setZoom(minZoom);
      this.middleView.showAlertNotification('notification-zoom-go-back');
    }
  }

  removeLayer() {
    const { settings: { layerSlug }, resetData } = this.props;
    if (!this.removedFromUrl) {
      this.middleView.toggleLayer(layerSlug);
    }
    this.activatedFromUrl = false;
    this.removedFromUrl = false;
    resetData();
  }

  updateLayer(url) {
    const { settings: { layerSlug } } = this.props;
    this.middleView.updateLayer(layerSlug, {
      urlTemplate: url
    });
  }

  addBoundsPolygon(bounds, tile) {
    const { map } = this.middleView;
    const { description } = tile;

    if (this.boundsPolygon !== null) {
      this.removeBoundsPolygon();
    }
    const coords = [];
    bounds.forEach(item => {
      coords.push({
        lat: item[1],
        lng: item[0]
      });
    });

    this.boundsPolygon = new google.maps.Polygon({
      paths: coords,
      fillColor: 'transparent',
      strokeWeight: 0
    });
    const polygonCenter = getPolygonCenter(this.boundsPolygon);

    this.addBoundsPolygonEvents();
    this.boundsPolygon.setMap(map);

    if (this.boundsPolygonInfowindow !== null) {
      this.boundsPolygonInfowindow.close();
    }
    this.boundsPolygonInfowindow = new google.maps.InfoWindow({
      content: `<div class="recent-imagery-infowindow">${description}</div>`,
      position: polygonCenter.top
    });
  }

  addBoundsPolygonEvents() {
    const { setRecentImageryShowSettings } = this.props;
    const { map } = this.middleView;
    let clickTimeout = null;

    google.maps.event.addListener(this.boundsPolygon, 'mouseover', () => {
      const zoom = map.getZoom();
      if (zoom < 10) {
        this.boundsPolygon.setOptions({
          fillColor: '#000000',
          fillOpacity: 0.1,
          strokeColor: '#000000',
          strokeOpacity: 0.5,
          strokeWeight: 1
        });
        this.boundsPolygonInfowindow.open(map);
      }
    });
    google.maps.event.addListener(this.boundsPolygon, 'mouseout', () => {
      const zoom = map.getZoom();
      if (zoom < 10) {
        this.boundsPolygon.setOptions({
          fillColor: 'transparent',
          strokeWeight: 0
        });
        this.boundsPolygonInfowindow.close();
      }
    });
    google.maps.event.addListener(this.boundsPolygon, 'click', () => {
      clickTimeout = setTimeout(() => {
        setRecentImageryShowSettings(true);
      }, 200);
    });
    google.maps.event.addListener(this.boundsPolygon, 'dblclick', () => {
      clearTimeout(clickTimeout);
    });
  }

  removeBoundsPolygon() {
    this.boundsPolygon.setMap(null);
  }

  render() {
    return createElement(RecentImageryComponent, {
      ...this.props
    });
  }
}

RecentImageryContainer.propTypes = {
  active: PropTypes.bool,
  showSettings: PropTypes.bool,
  dataStatus: PropTypes.object,
  tile: PropTypes.object,
  bounds: PropTypes.array,
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  toogleRecentImagery: PropTypes.func,
  setRecentImageryShowSettings: PropTypes.func,
  getData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  resetData: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(
  RecentImageryDrag(RecentImageryContainer)
);
