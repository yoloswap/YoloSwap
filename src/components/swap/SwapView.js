import React from 'react';
import TokenSelector from '../commons/TokenSelector';

const SwapView = () => (
  <div className={"swap container"}>
    <div className={"swap__container"}>
      <div className={"swap__content"}>
        <div className={"swap__content-title"}>From:</div>
        <div className={"swap__content-box"}>
          <TokenSelector/>
          <input className={"swap__content-input"} type="text" placeholder="0"/>
        </div>
        <div className={"swap__content-info"}>2987.09896532 EOS</div>
      </div>

      <div className={"swap__icon"}/>

      <div className={"swap__content"}>
        <div className={"swap__content-title"}>To:</div>
        <div className={"swap__content-box"}>
          <TokenSelector/>
          <input className={"swap__content-input"} type="text" placeholder="0"/>
        </div>
        <div className={"swap__content-info right"}>1 EOS  = 412.348 POWR = 206.782 USD</div>
      </div>
    </div>

    <div className={"swap__bot"}>
      <div className={"swap__bot-button common__button-gradient"}>Swap Now</div>
      <div className={"swap__bot-term"}>
        <span>By Swapping, you agree to the </span>
        <a href="#" target="_blank">Terms and Conditions</a>
      </div>
    </div>
  </div>
);

export default SwapView
