import Body from './Body';
import React, { PureComponent } from 'react';
import './../../assets/scss/index.scss';
import * as globalActions from "../../actions/globalAction";
import * as accountActions from "../../actions/accountAction";
import * as swapActions from "../../actions/swapAction";
import { getMemo } from "../../services/network_service";
import { connect } from "react-redux";
import { isStringJson } from "../../utils/validators";

function mapDispatchToProps(dispatch) {
  return {
    setWidgetMode: () => {dispatch(globalActions.setWidgetMode())},
    setAccountWithBalances: (account) => {dispatch(accountActions.setAccountWithBalances(account))},
    completeSwap: (txResult) => {dispatch(swapActions.completeSwap(txResult))},
  }
}

class Widget extends PureComponent {
  componentWillMount = () => {
    this.props.setWidgetMode();

    this.sendHeightInterval = setInterval(this.sendHeight, 2000);

    window.addEventListener('message', this.watchPostMessages);
  };

  componentWillUnmount = () => {
    clearInterval(this.sendHeightInterval);
    window.removeEventListener('message', this.watchPostMessages);
  };

  sendHeight = () => {
    const body = document.getElementsByTagName('body')[0];
    let height = body.clientHeight < 1567 ? 1567 : body.clientHeight;

    window.parent.postMessage(JSON.stringify({
      action: 'setHeight',
      data: { height: height }
    }), "*");
  };

  sendTransaction = (params) => {
    const memo = getMemo(
      params.destPrecision,
      params.destSymbol,
      params.destTokenAccount,
      params.minConversionRate
    );

    window.parent.postMessage(JSON.stringify({
      action: 'transaction',
      data: {
        actions: [{
          account: params.srcTokenAccount,
          authorization: { actor: params.userAccount, permission: 'active' },
          data: { from: params.userAccount, to: params.networkAccount, quantity: `${params.srcAmount} ${params.srcSymbol}`, memo: memo },
          name: 'transfer'
        }]
      }
    }), "*");
  };

  watchPostMessages = (event) => {
    const eventData = isStringJson(event.data) ? JSON.parse(event.data) : event.data;
    const action = eventData.action;

    if (action === 'getAccount') {
      let account = eventData.data;
      account.name = account.account;

      this.props.setAccountWithBalances(account);
    } else if (action === 'transaction') {
      const txResult = eventData.data;
      this.props.completeSwap(txResult);
    }
  };

  render() {
    return <Body
      widgetMode={true}
      sendTransaction={this.sendTransaction}
    />
  }
}

export default connect(() => {return {}}, mapDispatchToProps)(Widget);