import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import * as swapActions from "../../actions/swapAction";
import * as accountAction from "../../actions/accountAction";
import { filterInputNumber } from "../../utils/validators";

function mapStateToProps(store) {
  const token = store.token;
  const account = store.account;
  const swap = store.swap;
  const tokens = token.tokens;

  return {
    tokens: tokens,
    sourceToken: swap.sourceToken,
    destToken: swap.destToken,
    sourceAmount: swap.sourceAmount,
    destAmount: swap.destAmount,
    tokenPairRate: swap.tokenPairRate,
    isTokenPairRateLoading: swap.isTokenPairRateLoading,
    tx: swap.tx,
    error: swap.error,
    account: account.account,
    isBalanceLoading: account.isBalanceLoading,
    isScatterLoading: account.isScatterLoading,
    isConfirmLoading: account.isConfirmLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSourceToken: (token) => {dispatch(swapActions.setSourceToken(token))},
    setDestToken: (token) => {dispatch(swapActions.setDestToken(token))},
    setSourceAmount: (amount) => {dispatch(swapActions.setSourceAmount(amount))},
    fetchTokenPairRate: () => {dispatch(swapActions.fetchTokenPairRate())},
    swapToken: () => {dispatch(swapActions.swapToken())},
    setError: (message) => {dispatch(swapActions.setError(message))},
    connectToScatter: () => {dispatch(accountAction.connectToScatter())},
    setScatterLoading: (isLoading) => {dispatch(accountAction.setScatterLoading(isLoading))},
  }
}

class Swap extends Component {
  componentDidMount = () => {
    this.props.fetchTokenPairRate();
  };

  handleOnClickSwapButton = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a swap");
      return;
    }

    if (!this.props.account) {
      this.props.connectToScatter();
    } else {
      this.props.swapToken();
    }
  };

  handleOnSourceAmountChange = (e) => {
    const isValueValid = filterInputNumber(e, e.target.value, this.props.sourceAmount);

    if (!isValueValid) return;

    this.props.setSourceAmount(e.target.value);
  };

  handleOnClickSwapIcon = () => {
    this.props.setSourceToken(this.props.destToken);
    this.props.setDestToken(this.props.sourceToken);
  };

  handleCloseScatterModal = () => {
    this.props.setScatterLoading(false);
  };

  render() {
    return (
      <SwapView
        onClickSwapButton={this.handleOnClickSwapButton}
        onClickSwapIcon={this.handleOnClickSwapIcon}
        onSelectSourceToken={this.props.setSourceToken}
        onSelectDestToken={this.props.setDestToken}
        onSourceAmountChange={this.handleOnSourceAmountChange}
        onCloseScatterModal={this.handleCloseScatterModal}
        tx={this.props.tx}
        sourceToken={this.props.sourceToken}
        destToken={this.props.destToken}
        sourceAmount={this.props.sourceAmount}
        destAmount={this.props.destAmount}
        tokens={this.props.tokens}
        tokenPairRate={this.props.tokenPairRate}
        account={this.props.account}
        error={this.props.error}
        isTokenPairRateLoading={this.props.isTokenPairRateLoading}
        isBalanceLoading={this.props.isBalanceLoading}
        isConfirmLoading={this.props.isConfirmLoading}
        isScatterLoading={this.props.isScatterLoading}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
