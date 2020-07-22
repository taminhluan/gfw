import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Share } from 'gfw-components';

import Modal from '../modal';

import './styles.scss';

class ShareModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    selected: PropTypes.string,
    copied: PropTypes.bool,
    data: PropTypes.object,
    loading: PropTypes.bool,
    setShareOpen: PropTypes.func,
    setShareSelected: PropTypes.func,
    handleFocus: PropTypes.func,
    handleCopyToClipboard: PropTypes.func,
  };

  render() {
    const { open, setShareOpen, data } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel={`Share: ${data && data.title}`}
        onRequestClose={() => setShareOpen(false)}
        title={this.props.data && this.props.data.title}
      >
        <Share {...data} token={process.env.BITLY_TOKEN} />
      </Modal>
    );
  }
}

export default ShareModal;
