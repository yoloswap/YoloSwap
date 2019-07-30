import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import * as swapActions from "../../actions/swapAction";
import * as accountAction from "../../actions/accountAction";
import * as globalActions from "../../actions/globalAction";
import { filterInputNumber } from "../../utils/validators";
import { findTokenBySymbol } from "../../utils/helpers";

function mapStateToProps(store) {
  const token = store.token;
  const account = store.account;
  const swap = store.swap;
  const transaction = store.transaction;
  const tokens = token.tokens;
  const widgetMode = store.global.widgetMode;

  return {
    tokens: tokens,
    sourceToken: swap.sourceToken,
    destToken: swap.destToken,
    sourceAmount: swap.sourceAmount,
    destAmount: swap.destAmount,
    tokenPairRate: swap.tokenPairRate,
    fluctuatingRate: swap.fluctuatingRate,
    isTokenPairRateLoading: swap.isTokenPairRateLoading,
    tx: transaction.tx,
    error: swap.error,
    isAccountImported: !!account.account,
    isBalanceLoading: account.isBalanceLoading,
    isScatterLoading: account.isScatterLoading,
    isConfirmLoading: account.isConfirmLoading,
    widgetMode: widgetMode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSourceToken: (token) => {dispatch(swapActions.setSourceToken(token))},
    setDestToken: (token) => {dispatch(swapActions.setDestToken(token))},
    setSourceAmount: (amount) => {dispatch(swapActions.setSourceAmount(amount))},
    fetchTokenPairRate: () => {dispatch(swapActions.fetchTokenPairRate())},
    swapToken: (sendTransaction) => {dispatch(swapActions.swapToken(sendTransaction))},
    setError: (message) => {dispatch(swapActions.setError(message))},
    setSourceAndDestToken: (srcToken, destToken) => {dispatch(swapActions.setSourceAndDestToken(srcToken, destToken))},
    connectToScatter: () => {dispatch(accountAction.connectToScatter())},
    setScatterLoading: (isLoading) => {dispatch(accountAction.setScatterLoading(isLoading))},
    setGlobalError: (error) => {dispatch(globalActions.setGlobalError(true, error))},
  }
}

class Swap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSwapBalanceBoxActive: false
    }
  }

  componentDidMount = () => {
    this.setSrcAndDestTokenFromParams();
    this.props.fetchTokenPairRate();
  };

  setSrcAndDestTokenFromParams = () => {
    const tokens = this.props.tokens;
    const srcSymbolParam = this.props.srcSymbolParam;
    const destSymbolParam = this.props.destSymbolParam;

    if (!srcSymbolParam || !destSymbolParam) return;

    let srcToken = findTokenBySymbol(tokens, srcSymbolParam);
    let destToken = findTokenBySymbol(tokens, destSymbolParam);

    if (!srcToken || !destToken) {
      srcToken = tokens[0];
      destToken = tokens[1];
      this.props.changeRouteParams(srcToken.symbol, destToken.symbol);
    }

    this.props.setSourceAndDestToken(srcToken, destToken);
  };

  confirmSwap = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a swap");
      return;
    }

    if (!this.props.isAccountImported) {
      if (this.props.widgetMode) {
        this.props.setGlobalError("Please logging in to make a swap");
      } else {
        this.props.connectToScatter();
      }
    } else {
      const sendTransaction = this.props.sendTransaction ? this.props.sendTransaction : false;
      this.props.swapToken(sendTransaction);
    }
  };

  setSourceAmount = (e) => {
    const isValueValid = filterInputNumber(e, e.target.value, this.props.sourceAmount);

    if (!isValueValid) return;

    this.props.setSourceAmount(e.target.value);
  };

  switchTokens = () => {
    this.props.setSourceAndDestToken(this.props.destToken, this.props.sourceToken);
    this.props.changeRouteParams(this.props.destToken.symbol, this.props.sourceToken.symbol);
  };

  closeScatterModal = () => {
    this.props.setScatterLoading(false);
  };

  openBalanceDropdown = () => {
    this.setState({ isSwapBalanceBoxActive: true });
  };

  closeBalanceDropdown = () => {
    this.setState({ isSwapBalanceBoxActive: false })
  };

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    const srcTokenBalance = this.props.sourceToken.balance;
    let sourceAmountByPercentage = (srcTokenBalance * (balancePercentage / 100)).toFixed(this.props.sourceToken.precision);

    if (!+sourceAmountByPercentage) sourceAmountByPercentage = 0;

    this.props.setSourceAmount(sourceAmountByPercentage);
    this.closeBalanceDropdown();
  };

  setSourceToken = (token) => {
    this.props.setSourceToken(token);
    this.props.changeRouteParams(token.symbol, this.props.destToken.symbol);
  };

  setDestToken = (token) => {
    this.props.setDestToken(token);
    this.props.changeRouteParams(this.props.sourceToken.symbol, token.symbol);
  };

  render() {
    return (
      <SwapView
        tx={this.props.tx}
        sourceToken={this.props.sourceToken}
        destToken={this.props.destToken}
        sourceAmount={this.props.sourceAmount}
        destAmount={this.props.destAmount}
        tokens={this.props.tokens}
        tokenPairRate={this.props.tokenPairRate}
        fluctuatingRate={this.props.fluctuatingRate}
        error={this.props.error}
        isSwapBalanceBoxActive={this.state.isSwapBalanceBoxActive}
        isAccountImported={this.props.isAccountImported}
        isTokenPairRateLoading={this.props.isTokenPairRateLoading}
        isBalanceLoading={this.props.isBalanceLoading}
        isConfirmLoading={this.props.isConfirmLoading}
        isScatterLoading={this.props.isScatterLoading}
        srcAmountRef={this.props.srcAmountRef}
        setSourceToken={this.setSourceToken}
        setDestToken={this.setDestToken}
        confirmSwap={this.confirmSwap}
        switchTokens={this.switchTokens}
        setSourceAmount={this.setSourceAmount}
        closeScatterModal={this.closeScatterModal}
        openBalanceDropdown={this.openBalanceDropdown}
        closeBalanceDropdown={this.closeBalanceDropdown}
        addSrcAmountByBalancePercentage={this.addSrcAmountByBalancePercentage}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
