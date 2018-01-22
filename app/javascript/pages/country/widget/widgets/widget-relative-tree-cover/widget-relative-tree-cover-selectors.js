import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import remove from 'lodash/remove';
import { sortByKey, getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

export const getSortedData = createSelector(
  [getData, getSettings, getLocation, getLocationsMeta, getColors],
  (data, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const dataMapped = [];
    const nonZeroData = remove(data, d => d.extent);
    console.log(colors);
    const colorRange = getColorPalette([colors.darkGreen, colors.lightGreen], nonZeroData.length);
    data.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      if (region) {
        dataMapped.push({
          label: (region && region.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
          path: `/country/${location.country}/${
            location.region ? `${location.region}/` : ''
          }${d.id}`
        });
      }
    });
    return sortByKey(uniqBy(dataMapped, 'label'), 'value', true).map((d, i) => ({
      ...d,
      color: d.value ? colorRange[i] : colors.nonForest
    }));
  }
);

export const getSentence = createSelector(
  [
    getSortedData,
    getSettings,
    getOptions,
    getLocation,
    getIndicator,
    getLocationNames
  ],
  (data, settings, options, location, indicator, locationNames) => {
    if (!data || !options || !indicator || !locationNames) return '';
    const { extentYear, threshold } = settings;
    const topRegion = data.length && data[0];
    const avgExtentPercentage = sumBy(data, 'percentage') / data.length;
    const sentence = `<b>${
      topRegion.label
    }</b> had the largest relative tree cover of <b>${format('.0f')(
      topRegion.percentage
    )}%</b>, compared to a regional average of <b>${format('.0f')(
      avgExtentPercentage
    )}%</b>, considering tree cover extent in <b>${extentYear}</b> with a canopy cover of greater than <b>${threshold}%</b>.`;

    return sentence;
  }
);
