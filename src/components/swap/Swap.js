import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import * as tokenAction from "../../actions/tokenAction";
import * as accountAction from "../../actions/accountAction";
import { filterInputNumber } from "../../utils/validators";

function mapStateToProps(store) {
  const token = store.token;
  const account = store.account;
  const sourceToken = token.sourceToken;

  return {
    tokens: token.list,
    sourceToken: sourceToken,
    destToken: token.destToken,
    sourceAmount: token.sourceAmount,
    destAmount: token.destAmount,
    tokenPairRate: token.tokenPairRate,
    isTokenPairRateLoading: token.isTokenPairRateLoading,
    error: token.error,
    tokenBalance: account.balances[sourceToken],
    isBalanceLoading: account.isBalanceLoading,
    isScatterLoading: account.isScatterLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSourceToken: (token) => {dispatch(tokenAction.setSourceToken(token))},
    setDestToken: (token) => {dispatch(tokenAction.setDestToken(token))},
    setSourceAmount: (amount) => {dispatch(tokenAction.setSourceAmount(amount))},
    fetchTokenPairRate: () => {dispatch(tokenAction.fetchTokenPairRate())},
    swapToken: () => {dispatch(tokenAction.swapToken())},
    connectToScatter: () => {dispatch(accountAction.connectToScatter())},
  }
}

class Swap extends Component {
  componentDidMount = () => {
    this.props.fetchTokenPairRate();
  };

  handleOnClickSwapButton = () => {
    this.props.connectToScatter();
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

  render() {
    return (
      <SwapView
        onClickSwapButton={this.handleOnClickSwapButton}
        onClickSwapIcon={this.handleOnClickSwapIcon}
        onSelectSourceToken={this.props.setSourceToken}
        onSelectDestToken={this.props.setDestToken}
        onSourceAmountChange={this.handleOnSourceAmountChange}
        isScatterLoading={this.props.isScatterLoading}
        tokens={this.props.tokens}
        sourceToken={this.props.sourceToken}
        sourceAmount={this.props.sourceAmount}
        destAmount={this.props.destAmount}
        destToken={this.props.destToken}
        tokenPairRate={this.props.tokenPairRate}
        isTokenPairRateLoading={this.props.isTokenPairRateLoading}
        isBalanceLoading={this.props.isBalanceLoading}
        tokenBalance={this.props.tokenBalance}
        error={this.props.error}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
