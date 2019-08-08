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

    /*document.addEventListener('scatterLoaded', () => {
      this.props.connectToScatter(false, true);
    });*/
  };

  render() {
    const isTitleShown = this.props.title === undefined || this.props.title === true;
    const isMarketShown = this.props.market === undefined || this.props.market === true;
    const isBackgroundShown = this.props.background === undefined || this.props.background === true;

    return (
      <div className={"body"}>
        <div className={"body__container container"}>
          {isTitleShown &&
            <div className={"body__content"}>
              <div className={"body__title"}>Simple Just Became Instant</div>
            {/*  <a className={"body__banner"} href={"https://medium.com/hello-yolo/introducing-yolo-weekly-swap-rewards-84cec5c96ad0"} target="_blank" rel="noopener noreferrer">
                <div className={"body__banner-title"}>Weekly Swap Rewards</div>
                <div className={"body__banner-link"}>Learn more</div>
              </a>*/}
            </div>
          }

          <Swap
            sendTransaction={this.props.sendTransaction}
            srcAmountRef={this.srcAmountRef}
            srcSymbolParam={this.props.srcSymbolParam}
            destSymbolParam={this.props.destSymbolParam}
            changeRouteParams={this.props.changeRouteParams}
          />

          {isMarketShown &&
            <Market
              srcAmountRef={this.srcAmountRef}
              changeRouteParams={this.props.changeRouteParams}
            />
          }

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

        {isBackgroundShown &&
          <div className={"body__background"}/>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);
