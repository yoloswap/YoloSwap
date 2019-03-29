import React, { Component } from 'react';
import Swap from '../swap/Swap';
import Market from '../market/Market';
import * as accountActions from "../../actions/accountAction";
import * as globalActions from "../../actions/globalAction";
import { connect } from "react-redux";
import * as scatterService from '../../services/scatter_service';
import Modal from '../commons/Modal';
import ModalScatter from '../commons/ModalScatter';
import appConfig from '../../config/app';

function mapStateToProps(state) {
  return {
    global: state.global,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setScatterEos: (eos) => {dispatch(accountActions.setScatterEos(eos))},
    connectToScatter: (needIdentity) => {dispatch(accountActions.connectToScatter(needIdentity))},
    unsetGlobalError: () => {dispatch(globalActions.setGlobalError(false))},
  }
}

class Body extends Component {
  componentWillMount = () => {
    const scatter = scatterService.initiateScatter();
    const eos = scatterService.getEosInstance(scatter);

    this.props.setScatterEos(eos);

    document.addEventListener('scatterLoaded', () => {
      this.props.connectToScatter(false);
    });
  };

  render() {
    return (
      <div className={"body"}>
        <div className={"body__container container"}>
          <div className={"body__content"}>
            <div className={"body__title"}>No Deposit, No Orderbook, Competitive Spreads</div>
            <div className={"body__sub-title"}>A simple way to exchange tokens</div>
          </div>
          <Swap/>
          <Market/>
          <Modal isActive={this.props.global.isErrorActive} handleClose={() => this.props.unsetGlobalError()} title="Error">
            <div className={"error-modal"}>
              {this.props.global.errorType !== appConfig.SCATTER_ERROR_TYPE && (
                <div className={"error-modal__message"}>{this.props.global.errorMessage}</div>
              )}

              {this.props.global.errorType === appConfig.SCATTER_ERROR_TYPE && (
                <ModalScatter/>
              )}
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);
