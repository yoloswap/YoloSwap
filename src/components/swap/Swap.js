import React, { Component } from 'react';
import SwapView from './SwapView';
import { connect } from 'react-redux';
import * as tokenAction from "../../actions/tokenAction";
import * as accountAction from "../../actions/accountAction";

function mapStateToProps(store) {
  const sourceToken = store.token.sourceToken;

  return {
    tokens: store.token.list,
    sourceToken: sourceToken,
    destToken: store.token.destToken,
    sourceAmount: store.token.sourceAmount,
    destAmount: store.token.destAmount,
    tokenPairRate: store.token.tokenPairRate,
    isTokenPairRateLoading: store.token.isTokenPairRateLoading,
    error: store.token.error,
    tokenBalance: store.account.balances[sourceToken],
    isBalanceLoading: store.account.isBalanceLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSourceToken: (token) => {dispatch(tokenAction.setSourceToken(token))},
    setDestToken: (token) => {dispatch(tokenAction.setDestToken(token))},
    setSourceAmount: (amount) => {dispatch(tokenAction.setSourceAmount(amount))},
    fetchTokenPairRate: () => {dispatch(tokenAction.fetchTokenPairRate())},
    swapToken: () => {dispatch(tokenAction.swapToken())},
    fetchBalances: () => {dispatch(accountAction.fetchBalances())},
  }
}

class Swap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isScatterModalOpen: false
    }
  }

  componentDidMount = () => {
    this.props.fetchTokenPairRate();
    this.props.fetchBalances();
  };

  handleOpenScatterModal = () => {
    this.setState({ isScatterModalOpen: true })
  };

  handleCloseScatterModal = () => {
    this.setState({ isScatterModalOpen: false })
  };

  handleOnClickSwapToken = () => {
    this.props.setSourceToken(this.props.destToken);
    this.props.setDestToken(this.props.sourceToken);
  };

  handleOnSourceAmountChange = (e) => {
    const value = e.target.value;
    this.props.setSourceAmount(value);
  };

  render() {
    return (
      <SwapView
        onOpenScatterModal={this.handleOpenScatterModal}
        onCloseScatterModal={this.handleCloseScatterModal}
        onSelectSourceToken={this.props.setSourceToken}
        onSelectDestToken={this.props.setDestToken}
        onClickSwapToken={this.handleOnClickSwapToken}
        onSourceAmountChange={this.handleOnSourceAmountChange}
        onSwapToken={this.props.swapToken}
        isScatterModalOpen={this.state.isScatterModalOpen}
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
