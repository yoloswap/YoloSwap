import React from 'react';
import { formatAmount } from "../../utils/helpers";
import appConfig from "../../config/app";
import envConfig from "../../config/env";
import { default as _ } from "underscore";

const MarketView = (props)=> {
  const getTokenList = () => {
    const sortedTokens = _(props.tokens).sortBy(function (token) {
      return !props.checkNewToken(token.listingTime);
    });

    return sortedTokens.map((token, index) => {
      if (!token.symbol.includes(props.searchText) || (token.id === envConfig.EOS.id)) {
        return null;
      }

      if (token.listingTime) {
        token.isNew = props.checkNewToken(token.listingTime);
      }

      return (
        <div key={index} className={`market__item common__fade-in ${token.isNew ? 'market__item--new' : ''}`}>
          <div className={"market__item-header"}>
            <div className={"common__flexbox none"}>
              <img className={"market__item-logo"} src={require(`../../assets/images/tokens/${token.logo}`)} alt=""/>
              <div className={"market__item-pair"}>{token.symbol}</div>
            </div>
            <div>
              <div className={"common__icon-chart"}/>
            </div>
          </div>
          <div className={"market__item-body"}>
            {renderLast24hChangePercentage(token)}
            <div className={"common__flexbox"}>
              <div className={"market__item-content"}>
                <div className={"market__item-rate"}>{renderRate(token.buyRate, token.buyRateUsd)}</div>
                <div className={"market__item-button market__item-button--blue"} onClick={() => props.setSwapToken(envConfig.EOS, token)}>Buy</div>
              </div>
              <div className={"market__item-content"}>
                <div className={"market__item-rate"}>{renderRate(token.sellRate, token.sellRateUsd)}</div>
                <div className={"market__item-button"} onClick={() => props.setSwapToken(token, envConfig.EOS)}>Sell</div>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  const renderRate = (tokenBasedRate, usdRate) => {
    let rate = tokenBasedRate;

    if (props.indexToken.id === envConfig.USD.id) {
      rate = usdRate;
    }

    return <div className={"market__table-text"}>{rate ? formatAmount(rate) : 0}</div>
  };

  const renderLast24hChangePercentage = (token) => {
    const changePercentageField = props.indexToken.id === envConfig.EOS.id ? 'eosChangePercentage' : 'usdChangePercentage';

    return (
      <div className={"common__flexbox center"}>
        <div>L24h</div>
        {token[changePercentageField] > 0 && (
          <div className={"market__item-change"}>{token[changePercentageField].toFixed(2)}%</div>
        )}
        {token[changePercentageField] < 0 && (
          <div className={"market__item-change down"}>{token[changePercentageField].toFixed(2)}%</div>
        )}
        {!token[changePercentageField] && (
          <div className={"market__item-change none"}>---</div>
        )}
      </div>
    )
  };

  return (
    <div className={"market"}>
      <div className={"market__header common__flexbox"}>
        <div className={"market__header-content"}>
          <div className={"market__header-title"}>{props.indexToken.name} Market</div>
          <div className={`market__header-switcher ${props.indexToken.id}`}>
            {appConfig.MARKET_BASED_TOKENS.map((basedToken, index) => {
              return (
                <div
                  key={index}
                  className={`market__header-market`}
                  onClick={() => props.onClickBasedToken(basedToken)}
                >
                  {basedToken.symbol}
                </div>
              )
            })}
          </div>
        </div>
        <div className={"market__header-input"}>
          <input type="text" placeholder="Search" value={props.searchText} onChange={(e) => props.onTypingSearch(e)}/>
        </div>
      </div>

      <div className={"market__body"}>
        <div className={"market__body-list"}>
          {!props.isLoading && (
            getTokenList()
          )}
        </div>

        {props.isLoading && (
          <div className={"market__body-loading"}>
            <div>Fetching market rates...</div>
            <div className={"common__loading"}/>
          </div>
        )}
      </div>
    </div>
  )
};

export default MarketView;
