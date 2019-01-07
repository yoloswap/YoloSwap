import React, { Component } from 'react';
import SwapView from './SwapView';

export default class Swap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isScatterModalOpen: false,
    }
  }

  handleOpenScatterModal = () => {
    this.setState({ isScatterModalOpen: true })
  };

  handleCloseScatterModal = () => {
    this.setState({ isScatterModalOpen: false })
  };

  render() {
    return (
      <SwapView
        handleOpenScatterModal={this.handleOpenScatterModal}
        handleCloseScatterModal={this.handleCloseScatterModal}
        isScatterModalOpen={this.state.isScatterModalOpen}
      />
    )
  }
}
