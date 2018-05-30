export default {
  title: 'Intact forest',
  config: {
    size: 'small',
    landCategories: ['wdpa', 'mining', 'landmark'],
    categories: ['land-cover'],
    admins: ['global', 'country', 'region', 'subRegion'],
    selectors: ['landCategories', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_ifl',
    layers: ['forest2000', 'forest2010', 'ifl_2013_deg'],
    sortOrder: {
      landCover: 3
    },
    sentences: {
      initial:
        'As of 2013, {percentage} of {location} tree cover was <b>intact forest</b>.',
      withIndicator:
        'As of 2013, {percentage} of {location} tree cover within {indicator} was <b>intact forest</b>.'
    }
  },
  settings: {
    forestType: 'ifl_2013',
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010', 'ifl_2013_deg']
  },
  enabled: true
};
