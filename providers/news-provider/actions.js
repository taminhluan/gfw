import { createAction, createThunkAction } from 'redux/actions';

import { getNewsProvider } from 'services/news';

export const setNewsLoading = createAction('setNewsLoading');
export const setNews = createAction('setNews');

export const getNews = createThunkAction('getNews', () => (dispatch) => {
  dispatch(setNewsLoading(true));
  getNewsProvider()
    .then((response) => {
      const { data } = response.data;
      if (data && !!data.length) {
        dispatch(setNews(data));
      }
      dispatch(setNewsLoading(false));
    })
    .catch(() => {
      dispatch(setNewsLoading(false));
    });
});
