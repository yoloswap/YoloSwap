import React, { Component } from 'react';
import Modal from '../commons/Modal';
import TokenSelector from '../commons/TokenSelector';
import { formatAmount } from "../../utils/helpers";
import envConfig from '../../config/env';
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";

export default class SwapView extends Component {
  render() {
    const isError = !!this.props.error;
    const isSwapBalanceBoxShown = this.props.isAccountImported && !this.props.isBalanceLoading;
    const disabledClass = (isError || this.props.isTokenPairRateLoading) ? 'disabled' : '';
    const isButtonHidden = this.props.tx.isConfirming || this.props.tx.isBroadcasting || this.props.tx.id || this.props.tx.error;

    return (
      <div className={"swap"}>
        <div className={"swap__container"}>
          <div className={"swap__content"}>
            <div className={"swap__content-title"}>From:</div>
            <div className={`swap__content-box ${isError ? 'swap__content-box--error' : ''} ${isSwapBalanceBoxShown ? 'swap__content-box--imported' : ''}`}>
              <TokenSelector
                selectedToken={this.props.sourceToken}
                onSelectedToken={this.props.handleSelectSourceToken}
                tokens={this.props.tokens}
                showBalance={true}
              />
              <input className={"swap__content-input"} type="text" placeholder="0" value={this.props.sourceAmount} onChange={(e) => this.props.handleSourceAmountChange(e)} ref={this.props.srcAmountRef}/>
              <Dropdown
                className={"swap__content-dropdown-container"}
                active={this.props.isSwapBalanceBoxActive}
                onShow={() => this.props.handleOpenSwapBalanceBox()}
                onHide={() => this.props.handleCloseSwapBalanceBox()}
              >
                <DropdownTrigger>
                  <div className={`common__arrow-drop-down grey ${this.props.isSwapBalanceBoxActive ? 'up' : 'down'}`}/>
                </DropdownTrigger>
                <DropdownContent className={"swap__content-dropdown-box common__fade-in"}>
                  <div onClick={() => this.props.addSrcAmountByBalancePercentage(25)}>Swap 25% balance</div>
                  <div onClick={() => this.props.addSrcAmountByBalancePercentage(50)}>Swap 50% balance</div>
                  <div onClick={() => this.props.addSrcAmountByBalancePercentage(100)}>Swap 100% balance</div>
                </DropdownContent>
              </Dropdown>
            </div>

            {this.props.error && (
              <div className={"common__error under-input"}>{this.props.error}</div>
            )}

            <div className={"swap__content-info"}>
              {this.props.isAccountImported && (
                <div className={"common__flexbox"}>
                  Balance: {this.props.isBalanceLoading ? <div className={"swap__content-loading common__loading"}/> : this.props.sourceToken.balance} {this.props.sourceToken.symbol}
                </div>
              )}
            </div>
          </div>
          <div className={"swap__icon"} onClick={() => this.props.handleClickSwapIcon()}/>
          <div className={"swap__content"}>
            <div className={"swap__content-title"}>To:</div>
            <div className={"swap__content-box"}>
              <TokenSelector
                selectedToken={this.props.destToken}
                onSelectedToken={this.props.handleSelectDestToken}
                tokens={this.props.tokens}
              />
              <div className={"swap__content-input"}>
                {this.props.sourceAmount ? this.props.isTokenPairRateLoading ? 'Loading...' : formatAmount(this.props.destAmount, this.props.destToken.precision) : 0}
              </div>
            </div>
            <div className={"swap__content-info right"}>
              {this.props.sourceToken.symbol}/{this.props.destToken.symbol} = {!this.props.isTokenPairRateLoading ?
              formatAmount(this.props.tokenPairRate, 6) :
              <div className={"swap__content-loading common__loading"}/>}
            </div>
          </div>
        </div>

        {this.props.tx.isConfirming && (
          <div className={"swap__text common__fade-in"}>Waiting for confirmation from your wallet…</div>
        )}

        {this.props.tx.isBroadcasting && (
          <div className={"swap__text common__fade-in loading"}>Waiting for the transaction to be accepted</div>
        )}

        {this.props.tx.error && (
          <div className={"swap__text common__fade-in error"}>{this.props.tx.error}</div>
        )}

        {this.props.tx.id && (
          <div className={"swap__text common__fade-in"}>Successfully! The <a rel="noopener noreferrer" href={`${envConfig.TX_URL}${this.props.tx.id}`} target="_blank">transaction</a> is accepted</div>
        )}

        {!isButtonHidden && (
          <div className={"swap__bot common__fade-in"}>
            <div className={`swap__bot-button common__button-gradient ${disabledClass}`} onClick={() => this.props.handleClickSwapButton()}>Swap Now</div>
            <div className={"swap__bot-term"}>
              <span>By Swapping, you agree to the </span>
              <a href="/" target="_blank">Terms and Conditions</a>
            </div>
          </div>
        )}

        {(process.env.REACT_APP_ENV === 'local' || process.env.REACT_APP_ENV === 'development') && (
          <div className={"swap__faucet-link"}>
            <span>Receive some EOS testnet </span>
            <a href="https://monitor.jungletestnet.io/#faucet" target="_blank" rel="noopener noreferrer">here</a>
          </div>
        )}

        <Modal isActive={this.props.isScatterLoading} handleClose={() => this.props.handleCloseScatterModal()} title="Sign In">
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
