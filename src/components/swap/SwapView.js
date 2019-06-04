import React  from 'react';
import Modal from '../commons/Modal';
import TokenSelector from '../commons/TokenSelector';
import { formatAmount } from "../../utils/helpers";
import envConfig from '../../config/env';
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";
import ReactTooltip from 'react-tooltip';

function getContentForTooltipRate(fluctuatingRate) {
  return `Price is dependent on your source amount. There is a ${fluctuatingRate}% difference in price for the requested quantity compared to the default source amount of 1 EOS`
}

const SwapView = (props)=> {
  const isError = !!props.error;
  const isSwapBalanceBoxShown = props.isAccountImported && !props.isBalanceLoading;
  const disabledClass = (isError || props.isTokenPairRateLoading) ? 'disabled' : '';
  const isButtonHidden = props.tx.isConfirming || props.tx.isBroadcasting || props.tx.hash || props.tx.error;

  return (
    <div className={"swap"}>
      <div className={"swap__container"}>
        <div className={"swap__content"}>
          <div className={"swap__content-title"}>From:</div>
          <div className={`swap__content-box ${isError ? 'swap__content-box--error' : ''} ${isSwapBalanceBoxShown ? 'swap__content-box--imported' : ''}`}>
            <TokenSelector
              selectedToken={props.sourceToken}
              onSelectedToken={props.handleSelectSourceToken}
              tokens={props.tokens}
              showBalance={true}
            />
            <input className={"swap__content-input"} type="text" placeholder="0" value={props.sourceAmount} onChange={(e) => props.handleSourceAmountChange(e)} ref={props.srcAmountRef}/>
            <Dropdown
              className={"swap__content-dropdown-container"}
              active={props.isSwapBalanceBoxActive}
              onShow={() => props.handleOpenSwapBalanceBox()}
              onHide={() => props.handleCloseSwapBalanceBox()}
            >
              <DropdownTrigger>
                <div className={`common__arrow-drop-down grey ${props.isSwapBalanceBoxActive ? 'up' : 'down'}`}/>
              </DropdownTrigger>
              <DropdownContent className={"swap__content-dropdown-box common__fade-in"}>
                <div onClick={() => props.addSrcAmountByBalancePercentage(25)}>Swap 25% of balance</div>
                <div onClick={() => props.addSrcAmountByBalancePercentage(50)}>Swap 50% of balance</div>
                <div onClick={() => props.addSrcAmountByBalancePercentage(100)}>Swap 100% of balance</div>
              </DropdownContent>
            </Dropdown>
          </div>

          {props.error && (
            <div className={"common__error under-input"}>{props.error}</div>
          )}

          <div className={"swap__content-info"}>
            {props.isAccountImported && (
              <div className={"common__flexbox"}>
                Balance: {props.isBalanceLoading ? <div className={"swap__content-loading common__loading"}/> : props.sourceToken.balance ? props.sourceToken.balance : 0} {props.sourceToken.symbol}
              </div>
            )}
          </div>
        </div>
        <div className={"swap__icon"} onClick={() => props.handleClickSwapIcon()}/>
        <div className={"swap__content"}>
          <div className={"swap__content-title"}>To:</div>
          <div className={"swap__content-box"}>
            <TokenSelector
              selectedToken={props.destToken}
              onSelectedToken={props.handleSelectDestToken}
              tokens={props.tokens}
            />
            <div className={"swap__content-input"}>
              {props.sourceAmount ? props.isTokenPairRateLoading ? 'Loading...' : formatAmount(props.destAmount, props.destToken.precision) : 0}
            </div>
          </div>
          <div className={"swap__content-info right"}>
            {props.sourceToken.symbol}/{props.destToken.symbol} = {!props.isTokenPairRateLoading ?
            formatAmount(props.tokenPairRate, 6) :
            <div className={"swap__content-loading common__loading"}/>}

            {props.fluctuatingRate > 0 && (
              <div className={"common__inline-block common__fade-in"}>
                <span className={"common__decreased-number common__ml5"}>{props.fluctuatingRate}%</span>
                <span className={"common__tooltip common__ml5"} data-tip=""/>
                <ReactTooltip className={"common__tooltip-content"} effect="solid" getContent={() => getContentForTooltipRate(props.fluctuatingRate)}/>
              </div>
            )}
          </div>
        </div>
      </div>

      {props.tx.isConfirming && (
        <div className={"swap__text common__fade-in"}>Waiting for confirmation from your wallet…</div>
      )}

      {props.tx.isBroadcasting && (
        <div className={"swap__text common__fade-in loading"}>Waiting for the transaction to be accepted</div>
      )}

      {props.tx.error && (
        <div className={"swap__text common__fade-in error"}>{props.tx.error}</div>
      )}

      {props.tx.hash && (
        <div className={"swap__text common__fade-in"}>Successfully! The <a rel="noopener noreferrer" href={`${envConfig.TX_URL}${props.tx.hash}`} target="_blank">transaction</a> is accepted</div>
      )}

      {!isButtonHidden && (
        <div className={"swap__bot common__fade-in"}>
          <div className={`swap__bot-button common__button-gradient ${disabledClass}`} onClick={() => props.handleClickSwapButton()}>Swap Now</div>
          <div className={"swap__bot-term"}>
            <span>By Swapping, you agree to the </span>
            <a href="https://docs.google.com/document/d/1Bmy1uzQiPdLPmccbA4nXQPddKRpkVIC3JXDQmh3zYQo/edit" target="_blank" rel="noreferrer noopener">
              Terms and Conditions
            </a>
          </div>
        </div>
      )}

      {(process.env.REACT_APP_ENV === 'local' || process.env.REACT_APP_ENV === 'development') && (
        <div className={"swap__faucet-link"}>
          <span>Receive some EOS testnet </span>
          <a href="https://monitor.jungletestnet.io/#faucet" target="_blank" rel="noopener noreferrer">here</a>
        </div>
      )}

      <Modal isActive={props.isScatterLoading} handleClose={() => props.handleCloseScatterModal()} title="Sign In">
        <div className={"scatter-modal"}>
          <div className={"scatter-modal__connecting"}>Connecting with your Scatter</div>
          <div className={"scatter-modal__loading common__loading"}/>
          <div className={"scatter-modal__logo"}/>
        </div>
      </Modal>
    </div>
  )
};

export default SwapView;
