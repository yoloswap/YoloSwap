import React, { PureComponent } from 'react';
import Swap from '../swap/Swap';
import Market from '../market/Market';
import * as accountActions from "../../actions/accountAction";
import * as globalActions from "../../actions/globalAction";
import { connect } from "react-redux";
import * as scatterService from '../../services/scatter_service';
import Modal from '../commons/Modal';
import ModalScatter from '../commons/ModalScatter';
import appConfig from '../../config/app';

function mapStateToProps(store) {
  return {
    global: store.global,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setScatterEos: (eos) => {dispatch(accountActions.setScatterEos(eos))},
    connectToScatter: (isLoadingNeeded, firstTimeConnect) => {dispatch(accountActions.connectToScatter(isLoadingNeeded, firstTimeConnect))},
    unsetGlobalError: () => {dispatch(globalActions.setGlobalError(false))},
  }
}

class Body extends PureComponent {
  constructor(props) {
    super(props);
    this.srcAmountRef = React.createRef();
  };

  componentWillMount = () => {
    const scatterJs = scatterService.initiateScatter();
    const eos = scatterService.getEosInstance(scatterJs.scatter);

    this.props.setScatterEos(eos);

    if (this.props.widgetMode) return;

    this.props.connectToScatter(false, true);

    document.addEventListener('scatterLoaded', () => {
      this.props.connectToScatter(false, true);
    });
  };

  render() {
    return (
      <div className={"body"}>
        <div className={"body__container container"}>
          <div className={"body__content"}>
            <div className={"body__title"}>Simple Just Became Instant</div>
            {/*<div className={"body__sub-title"}>Swap tokens without involving any intermediate token</div>*/}
          </div>

          <Swap
            sendTransaction={this.props.sendTransaction}
            srcAmountRef={this.srcAmountRef}
            srcSymbolParam={this.props.srcSymbolParam}
            destSymbolParam={this.props.destSymbolParam}
            changeRouteParams={this.props.changeRouteParams}
          />

          <Market
            srcAmountRef={this.srcAmountRef}
            changeRouteParams={this.props.changeRouteParams}
          />

          <Modal widgetMode={this.props.global.widgetMode} isActive={this.props.global.isErrorActive} handleClose={() => this.props.unsetGlobalError()} title="Error">
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
