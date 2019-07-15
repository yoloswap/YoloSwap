import Body from './Body';
import React, { PureComponent } from 'react';
import './../../assets/scss/index.scss';
import * as globalActions from "../../actions/globalAction";
import * as accountActions from "../../actions/accountAction";
import * as tokenActions from "../../actions/tokenAction";
import * as swapActions from "../../actions/swapAction";
import { getMemo } from "../../services/network_service";
import { connect } from "react-redux";
import { isStringJson } from "../../utils/validators";
import appConfig from "../../config/app";
import envConfig from "../../config/env";

function mapDispatchToProps(dispatch) {
  return {
    setWidgetMode: () => {dispatch(globalActions.setWidgetMode())},
    setAccountWithBalances: (account) => {dispatch(accountActions.setAccountWithBalances(account))},
    completeSwap: (txResult) => {dispatch(swapActions.completeSwap(txResult))},
    setTokens: (tokens) => {dispatch(tokenActions.setTokens(tokens))},
    setDestToken: (token) => {dispatch(swapActions.setDestToken(token))},
  }
}

class Widget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      appHeight: 0,
      market: true,
      title: true,
      background: true,
    }
  }

  componentWillMount = () => {
    this.props.setWidgetMode();

    window.parent.postMessage('{"action":"getConfig","data":{"tokens": ["CHEX", "CUSD", "EMT"], "title": false, "market": false, "background": false}}', "*");

    this.sendHeightInterval = setInterval(this.sendHeight, 2000);

    window.addEventListener('message', this.watchPostMessages, false);
  };

  componentWillUnmount = () => {
    clearInterval(this.sendHeightInterval);
    window.removeEventListener('message', this.watchPostMessages);
  };

  sendHeight = () => {
    const body = document.getElementsByTagName('body')[0];
    let height = body.clientHeight < appConfig.MIN_APP_HEIGHT ? appConfig.MIN_APP_HEIGHT : body.clientHeight;

    if (height === this.state.appHeight) return;

    this.setState({ appHeight: height });

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
      origin: true,
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
    } else if (action === 'transaction' && !eventData.origin) {
      const txResult = eventData.data;

      this.props.completeSwap(txResult);
    } else if (action === 'getConfig') {
      const limitedTokens = eventData.data.tokens;
      const market = eventData.data.market;
      const title = eventData.data.title;
      const background = eventData.data.background;

      if (limitedTokens.length) {
        const tokens = envConfig.TOKENS.filter(token => {
          return limitedTokens.includes(token.symbol) || token.symbol === envConfig.EOS.symbol;
        });

        if (tokens.length <= 1) return;

        this.props.setTokens(tokens);
        this.props.setDestToken(tokens[1]);
      }

      if (market !== undefined) {
        this.setState({ market: market });
      }

      if (title !== undefined) {
        this.setState({ title: title });
      }

      if (background !== undefined) {
        this.setState({ background: background });
      }
    }
  };

  render() {
    return (
      <Body
        widgetMode={true}
        market={this.state.market}
        title={this.state.title}
        background={this.state.background}
        sendTransaction={this.sendTransaction}
        changeRouteParams={() => false}
      />
    )
  }
}

export default connect(() => {return {}}, mapDispatchToProps)(Widget);
