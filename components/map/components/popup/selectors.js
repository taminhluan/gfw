import { createSelector, createStructuredSelector } from 'reselect';

import {
  getActiveDatasetsFromState,
  getInteractions,
  getInteractionSelected,
} from 'components/map/selectors';

const getLatitude = (state) => state?.map?.data?.interactions?.latlng?.lat;
const getLongitude = (state) => state?.map?.data?.interactions?.latlng?.lng;

export const getShowPopup = createSelector(
  [getLatitude, getLongitude, getInteractionSelected],
  (lat, lng, interaction) => lat && lng && !interaction?.data?.cluster
);

export const getInteractionsOptions = createSelector(
  getInteractions,
  (interactions) =>
    interactions?.map((i) => ({ label: i?.layer?.name, value: i?.layer?.id }))
);

export const getInteractionsOptionSelected = createSelector(
  getInteractionSelected,
  (selected) => ({ label: selected?.layer?.name, value: selected?.layer?.id })
);

export const getInteractionWithContext = createSelector(
  [getInteractionSelected],
  (interaction = {}) => {
    const { layer, geometry } = interaction || {};
    const isAoi = layer?.name === 'Area of Interest';
    const isArticle = !!layer?.interactionConfig?.article;
    const isBoundary = layer?.isBoundary;
    const isPoint = geometry?.type === 'Point';

    return {
      ...interaction,
      isAoi,
      isArticle,
      isBoundary,
      isPoint,
    };
  }
);

export const getPopupProps = createStructuredSelector({
  latitude: getLatitude,
  longitude: getLongitude,
  showPopup: getShowPopup,
  interactionsOptions: getInteractionsOptions,
  interactionOptionSelected: getInteractionsOptionSelected,
  selected: getInteractionWithContext,
  activeDatasets: getActiveDatasetsFromState,
});
