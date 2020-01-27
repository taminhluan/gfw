export default {
  // key for url and state
  widget: 'gladAlerts',
  // title for header
  title: 'Deforestation Alerts in {location}',
  // sentences for header
  sentence: {
    initial:
      'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
    withIndicator:
      'There were {count} GLAD alerts reported in {indicator} in the week of the {date}. This was {status} compared to the same week in previous years.'
  },
  // meta key for info button
  metaKey: 'widget_deforestation_graph',
  // full width or not
  large: true,
  // can show on map analysis
  analysis: true,
  // internal category for colors and filters
  colors: 'loss',
  // data source for filtering
  source: 'gadm',
  // data source for filtering
  dataType: 'loss',
  // categories to show widget on
  categories: ['summary', 'forest-change'],
  // types widget is available for
  types: ['country'],
  // levels of that type you can see the widget
  admins: ['adm0', 'adm1', 'adm2'],
  // layers to show on map
  datasets: [
    // GLAD
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  // position
  sortOrder: {
    summary: 6,
    forestChange: 9
  },
  // whitelists for options
  options: {
    weeks: [13, 26, 52]
    // forestTypes: true,
    // landCategories: true
  },
  // custom whitelists for locations
  whitelistType: 'glad',
  whitelists: {
    adm0: [
      'ABW',
      'AGO',
      'AIA',
      'ARG',
      'ATG',
      'AUS',
      'BDI',
      'BEN',
      'BES',
      'BFA',
      'BGD',
      'BHS',
      'BLM',
      'BLZ',
      'BOL',
      'BRA',
      'BRB',
      'BRN',
      'BTN',
      'BWA',
      'CAF',
      'CHL',
      'CHN',
      'CIV',
      'CMR',
      'COD',
      'COG',
      'COL',
      'COM',
      'CRI',
      'CUB',
      'CUW',
      'CYM',
      'DMA',
      'DOM',
      'ECU',
      'EGY',
      'ESP',
      'ETH',
      'FJI',
      'GAB',
      'GHA',
      'GIN',
      'GLP',
      'GMB',
      'GNB',
      'GNQ',
      'GRD',
      'GTM',
      'GUF',
      'GUY',
      'HKG',
      'HND',
      'HTI',
      'IDN',
      'IND',
      'IRN',
      'JAM',
      'JPN',
      'KEN',
      'KHM',
      'KNA',
      'LAO',
      'LBR',
      'LCA',
      'LKA',
      'LSO',
      'MAC',
      'MAF',
      'MDG',
      'MEX',
      'MLI',
      'MMR',
      'MOZ',
      'MSR',
      'MTQ',
      'MUS',
      'MWI',
      'MYS',
      'MYT',
      'NAM',
      'NCL',
      'NER',
      'NGA',
      'NIC',
      'NPL',
      'OMN',
      'PAK',
      'PAN',
      'PER',
      'PHL',
      'PLW',
      'PNG',
      'PRI',
      'PRY',
      'REU',
      'RUS',
      'RWA',
      'SDN',
      'SEN',
      'SGP',
      'SLB',
      'SLE',
      'SLV',
      'SOM',
      'SSD',
      'SUR',
      'SWZ',
      'SXM',
      'SYC',
      'TCA',
      'TCD',
      'TGO',
      'THA',
      'TLS',
      'TTO',
      'TWN',
      'TZA',
      'UGA',
      'USA',
      'VCT',
      'VEN',
      'VGB',
      'VIR',
      'VNM',
      'VUT',
      'YEM',
      'ZAF',
      'ZMB',
      'ZWE'
    ]
  }
};
