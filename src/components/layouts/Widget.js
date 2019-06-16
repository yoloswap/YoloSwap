import Body from './Body';
import React, { PureComponent } from 'react';
import './../../assets/scss/index.scss';
import * as globalActions from "../../actions/globalAction";
import * as accountActions from "../../actions/accountAction";
import * as swapActions from "../../actions/swapAction";
import { getMemo } from "../../services/network_service";
import { connect } from "react-redux";

function mapDispatchToProps(dispatch) {
  return {
    setWidgetMode: () => {dispatch(globalActions.setWidgetMode())},
    setAccountWithBalances: (account) => {dispatch(accountActions.setAccountWithBalances(account))},
    completeSwap: (transactionId, srcAmount, sourceTokenSymbol, destAmount, destSymbol) => {dispatch(swapActions.completeSwap(transactionId, srcAmount, sourceTokenSymbol, destAmount, destSymbol))},
  }
}

class Widget extends PureComponent {
  componentWillMount = () => {
    this.props.setWidgetMode();

    // window.parent.postMessage('{"action":"getAccount","data":{"account":"kybermainnet","authority":"active","publicKey":"EOS6qp6PrHYc9KTo2oWcqQXtNLDSkRZiTMWdfg7ygMnzGSRFDnnEU"}}', "*");

    this.sendHeight();

    window.addEventListener('message', this.watchPostMessages);
  };

  componentWillUnmount = () => {
    window.removeEventListener('message', this.watchPostMessages);
  };

  sendHeight = () => {
    const body = document.getElementsByTagName('body')[0];
    let height = body.clientHeight < 1567 ? 1567 : body.clientHeight;

    window.parent.postMessage(JSON.stringify({
      action: 'setHeight',
      height: height
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
        account: params.srcTokenAccount,
        authorization: { actor: params.userAccount, permission: 'active' },
        data: { from: params.userAccount, to: params.networkAccount, quantity: params.srcAmount, memo: memo },
        name: 'transfer'
      }
    }), "*");
  };

  watchPostMessages = (event) => {
    const eventData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    const action = eventData.action;

    console.log('=================EVENT=================');
    console.log(eventData);

    if (action === 'getAccount') {
      let account = eventData.data;
      account.name = account.account;

      this.props.setAccountWithBalances(account);
    } else if (action === 'transaction' && eventData.data.transaction_id) {
      const transactionId = eventData.data.transaction_id;
      this.props.completeSwap(transactionId);
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
