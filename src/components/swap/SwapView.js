import React, { Component } from 'react';
import Modal from '../commons/Modal';
import TokenSelector from '../commons/TokenSelector';
import { formatAmount } from "../../utils/helpers";

export default class SwapView extends Component {
  render() {
    let isError = false;
    let errors = {
      sameToken: this.props.sourceToken === this.props.destToken,
      commonError: this.props.error
    };

    Object.values(errors).forEach((error) => {
      if (error) isError = true;
    });

    const disabledClass = (isError || !this.props.sourceAmount || this.props.isTokenPairRateLoading) ? 'disabled' : '';

    return (
      <div className={"swap container"}>
        <div className={"swap__container"}>
          <div className={"swap__content"}>
            <div className={"swap__content-title"}>From:</div>
            <div className={`swap__content-box ${isError ? 'error' : ''}`}>
              <TokenSelector
                selectedToken={this.props.sourceToken}
                onSelectedToken={this.props.onSelectSourceToken}
                tokens={this.props.tokens}
                showBalance={true}
              />
              <input className={"swap__content-input"} type="text" placeholder="0" value={this.props.sourceAmount} onChange={(e) => this.props.onSourceAmountChange(e)}/>
            </div>

            {errors.sameToken && (
              <div className={"common__error under-input"}>Cannot exchange the same token</div>
            )}

            {errors.commonError && (
              <div className={"common__error under-input"}>{errors.commonError}</div>
            )}

            <div className={"swap__content-info"}>
              Balance: {!this.props.isBalanceLoading ? formatAmount(this.props.tokenBalance, 6) : <div className={"swap__content-loading common__loading"}/>} {this.props.sourceToken}
            </div>
          </div>

          <div className={"swap__icon"} onClick={() => this.props.onClickSwapToken()}/>

          <div className={"swap__content"}>
            <div className={"swap__content-title"}>To:</div>
            <div className={"swap__content-box"}>
              <TokenSelector
                selectedToken={this.props.destToken}
                onSelectedToken={this.props.onSelectDestToken}
                tokens={this.props.tokens}
              />
              <div className={"swap__content-input"}>
                {this.props.sourceAmount ? this.props.isTokenPairRateLoading ? 'Loading...' : formatAmount(this.props.destAmount, 6) : 0}
              </div>
            </div>
            <div className={"swap__content-info right"}>
              1 {this.props.sourceToken} = {!this.props.isTokenPairRateLoading ?
              formatAmount(this.props.tokenPairRate, 6) :
              <div className={"swap__content-loading common__loading"}/>} {this.props.destToken}
            </div>
          </div>
        </div>

        <div className={"swap__bot"}>
          <div className={`swap__bot-button common__button-gradient ${disabledClass}`} onClick={() => this.props.onSwapToken()}>Swap Now</div>
          <div className={"swap__bot-term"}>
            <span>By Swapping, you agree to the </span>
            <a href="/" target="_blank">Terms and Conditions</a>
          </div>
        </div>
        <Modal isActive={this.props.isScatterModalOpen} handleClose={this.props.onCloseScatterModal} title="Sign In">
          <div className={"common__loading"}/>
        </Modal>
      </div>
    )
  }
}
