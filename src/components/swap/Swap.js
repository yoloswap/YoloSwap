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
  const transaction = store.transaction;
  const tokens = token.tokens;

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
    setSourceAndDestToken: (srcToken, destToken) => {dispatch(swapActions.setSourceAndDestToken(srcToken, destToken))},
    connectToScatter: () => {dispatch(accountAction.connectToScatter())},
    setScatterLoading: (isLoading) => {dispatch(accountAction.setScatterLoading(isLoading))},
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
    this.props.fetchTokenPairRate();
  };

  handleClickSwapButton = () => {
    if (!this.props.sourceAmount) {
      this.props.setError("Source amount is required to make a swap");
      return;
    }

    if (!this.props.isAccountImported) {
      this.props.connectToScatter();
    } else {
      this.props.swapToken();
    }
  };

  handleSourceAmountChange = (e) => {
    const isValueValid = filterInputNumber(e, e.target.value, this.props.sourceAmount);

    if (!isValueValid) return;

    this.props.setSourceAmount(e.target.value);
  };

  handleClickSwapIcon = () => {
    this.props.setSourceAndDestToken(this.props.destToken, this.props.sourceToken);
  };

  handleCloseScatterModal = () => {
    this.props.setScatterLoading(false);
  };

  handleOpenSwapBalanceBox = () => {
    this.setState({ isSwapBalanceBoxActive: true });
  };

  handleCloseSwapBalanceBox = () => {
    this.setState({ isSwapBalanceBoxActive: false })
  };

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    const srcTokenBalance = this.props.sourceToken.balance;
    let sourceAmountByPercentage = (srcTokenBalance * (balancePercentage / 100)).toFixed(this.props.sourceToken.precision);

    if (!+sourceAmountByPercentage) sourceAmountByPercentage = 0;

    this.props.setSourceAmount(sourceAmountByPercentage);
    this.handleCloseSwapBalanceBox();
  };

  render() {
    return (
      <SwapView
        handleClickSwapButton={this.handleClickSwapButton}
        handleClickSwapIcon={this.handleClickSwapIcon}
        handleSelectSourceToken={this.props.setSourceToken}
        handleSelectDestToken={this.props.setDestToken}
        handleSourceAmountChange={this.handleSourceAmountChange}
        handleCloseScatterModal={this.handleCloseScatterModal}
        handleOpenSwapBalanceBox={this.handleOpenSwapBalanceBox}
        handleCloseSwapBalanceBox={this.handleCloseSwapBalanceBox}
        addSrcAmountByBalancePercentage={this.addSrcAmountByBalancePercentage}
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
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
