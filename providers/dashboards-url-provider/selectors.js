import { createSelector, createStructuredSelector } from 'reselect';

import { objDiff } from 'utils/data';

import { initialState as mapInitialState } from 'components/map/reducers';
import { initialState as dashboardPromptsInitialState } from 'components/prompts/dashboard-prompts/reducers';
import { initialState as areaOfInterestModalInitialState } from 'components/modals/area-of-interest/reducers';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMetaModalKey = (state) => state.modalMeta?.metakey;
export const selectDashboardPrompts = (state) =>
  state.dashboardPrompts?.settings;
export const selectWidgetSettings = (state) => state.widgets?.settings;
export const selectWidgetsCategory = (state) => state.widgets?.category;
export const selectAOIModalSettings = (state) => state.areaOfInterestModal;
export const selectShowMap = (state) => state.widgets?.showMap;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMetaModalKey,
    selectDashboardPrompts,
    selectWidgetSettings,
    selectWidgetsCategory,
    selectAOIModalSettings,
    selectShowMap,
  ],
  (
    map,
    modalMeta,
    dashboardPrompts,
    widgetsSettings,
    category,
    areaOfInterestModal,
    showMap
  ) => {
    return {
      map: objDiff(map, mapInitialState.settings),
      modalMeta,
      dashboardPrompts: objDiff(
        dashboardPrompts,
        dashboardPromptsInitialState.settings
      ),
      ...widgetsSettings,
      category,
      areaOfInterestModal: objDiff(
        areaOfInterestModal,
        areaOfInterestModalInitialState
      ),
      showMap,
    };
  }
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
