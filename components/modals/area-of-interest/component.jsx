import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Loader } from 'gfw-components';

import LoginForm from 'components/forms/login';
import ProfileForm from 'components/forms/profile';
import AreaOfInterestForm from 'components/forms/area-of-interest';

import Modal from '../modal';

import './styles.scss';

class AreaOfInterestModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    userData: PropTypes.object,
    loading: PropTypes.bool,
    canDelete: PropTypes.bool,
    setMenuSettings: PropTypes.func,
    viewAfterSave: PropTypes.bool,
    activeArea: PropTypes.object,
    setAreaOfInterestModalSettings: PropTypes.func,
  };

  handleCloseModal = () => {
    const { setMenuSettings, setAreaOfInterestModalSettings } = this.props;
    setAreaOfInterestModalSettings({ open: false, activeAreaId: null });
    setMenuSettings({ menuSection: 'my-gfw' });
  };

  render() {
    const {
      open,
      loading,
      userData,
      canDelete,
      viewAfterSave,
      activeArea,
    } = this.props;
    const { email, fullName, lastName, loggedIn, sector, subsector } =
      userData || {};
    const isProfileFormFilled =
      !!email &&
      (!!fullName || !!lastName) &&
      !!sector &&
      subsector &&
      (subsector.includes('Other')
        ? // if it's 'Other: <input>', we make sure that the input is not empty
          !!subsector.split('Other:')[1].trim()
        : // otherwise we just check the subsector
          !!subsector);

    return (
      <Modal
        isOpen={open}
        contentLabel={`${activeArea ? 'Edit' : 'Save'} area of interest`}
        onRequestClose={this.handleCloseModal}
        className="c-area-of-interest-modal"
      >
        <div className="save-aoi-body">
          {loading && <Loader />}
          {!loading && !loggedIn && <LoginForm />}
          {!loading && loggedIn && !isProfileFormFilled && (
            <ProfileForm source="AreaOfInterestModal" />
          )}
          {!loading && loggedIn && isProfileFormFilled && (
            <AreaOfInterestForm
              canDelete={canDelete}
              closeForm={this.handleCloseModal}
              viewAfterSave={viewAfterSave}
            />
          )}
        </div>
      </Modal>
    );
  }
}

export default AreaOfInterestModal;
