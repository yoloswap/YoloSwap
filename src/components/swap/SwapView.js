import React, { Component } from 'react';
import Modal from '../commons/Modal';
import TokenSelector from '../commons/TokenSelector';
import { formatAmount } from "../../utils/helpers";

export default class SwapView extends Component {
  render() {
    let isError = false;
    let errors = {
      sameToken: this.props.sourceTokenSymbol === this.props.destTokenSymbol,
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
                selectedToken={this.props.sourceTokenSymbol}
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
              {this.props.account !== null && (
                <div className={"common__flexbox"}>Balance: {this.props.isBalanceLoading ? <div className={"swap__content-loading common__loading"}/> : formatAmount(this.props.sourceToken.balance, 6)} {this.props.sourceTokenSymbol}</div>
              )}
            </div>
          </div>
          <div className={"swap__icon"} onClick={() => this.props.onClickSwapIcon()}/>
          <div className={"swap__content"}>
            <div className={"swap__content-title"}>To:</div>
            <div className={"swap__content-box"}>
              <TokenSelector
                selectedToken={this.props.destTokenSymbol}
                onSelectedToken={this.props.onSelectDestToken}
                tokens={this.props.tokens}
              />
              <div className={"swap__content-input"}>
                {this.props.sourceAmount ? this.props.isTokenPairRateLoading ? 'Loading...' : formatAmount(this.props.destAmount, 6) : 0}
              </div>
            </div>
            <div className={"swap__content-info right"}>
              1 {this.props.sourceTokenSymbol} = {!this.props.isTokenPairRateLoading ?
              formatAmount(this.props.tokenPairRate, 6) :
              <div className={"swap__content-loading common__loading"}/>} {this.props.destTokenSymbol}
            </div>
          </div>
        </div>

        <div className={"common__text fade-in center"}>{this.props.isConfirmLoading ? 'Waiting for confirmation from your wallet…' : ''}</div>

        <div className={"swap__bot"}>
          <div className={`swap__bot-button common__button-gradient ${disabledClass}`} onClick={() => this.props.onClickSwapButton()}>Swap Now</div>
          <div className={"swap__bot-term"}>
            <span>By Swapping, you agree to the </span>
            <a href="/" target="_blank">Terms and Conditions</a>
          </div>
        </div>
        <Modal isActive={this.props.isScatterLoading} handleClose={() => false} title="Sign In">
          <div className={"scatter-modal"}>
            <div className={"scatter-modal__connecting"}>Connecting with your Scatter</div>
            <div className={"scatter-modal__loading common__loading"}/>
            <div className={"scatter-modal__logo"}/>
          </div>
        </Modal>
      </div>
    )
  }
}
