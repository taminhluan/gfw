import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import useRouter from 'utils/router';

import Layout from 'layouts/page';
import MyGfw from 'layouts/my-gfw';
import MyGfwUrlProvider from 'providers/mygfw-url-provider';

import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';
import { setProfileModalOpen } from 'components/modals/profile/actions';

import { decodeParamsForState } from 'utils/stateToUrl';

const MyGfwPage = () => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const { areaOfInterestModal, profile } = decodeParamsForState(query) || {};
    if (areaOfInterestModal) {
      dispatch(setAreaOfInterestModalSettings(areaOfInterestModal));
    }

    if (profile) {
      dispatch(setProfileModalOpen(profile));
    }
  }, [fullPathname]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <Layout
      title="My GFW | Global Forest Watch"
      description="Create an account or log into My GFW. Explore the status of forests in custom areas by layering data to create custom maps of forest change, cover and use."
    >
      {ready && (
        <>
          <MyGfwUrlProvider />
          <MyGfw />
        </>
      )}
    </Layout>
  );
};

export default MyGfwPage;
