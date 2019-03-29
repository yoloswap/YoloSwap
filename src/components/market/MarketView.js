import React, { Component } from 'react';
import { formatAmount } from "../../utils/helpers";
import appConfig from "../../config/app";
import envConfig from "../../config/env";
import { sortBy } from 'underscore';

export default class MarketView extends Component {
  render() {
    const getTokenList = () => {
      let sortedTokens = this.props.tokens;

      if (this.props.sortKey) {
        sortedTokens = sortBy(sortedTokens, this.props.sortKey);

        if (this.props.sortDirection === 'desc') {
          sortedTokens = sortedTokens.reverse();
        }
      }

      return sortedTokens.map((token, index) => {
        if (!token.symbol.includes(this.props.searchText) || (token.symbol === envConfig.EOS.symbol)) {
          return null;
        }

        return (
          <tr key={index} className={"common__fade-in"}>
            <td className={"market__table-td market__table-first-col common__flexbox none"}>
              <img className={"market__table-icon"} src={require(`../../assets/images/tokens/${token.logo}`)} alt=""/>
              <div className={"market__table-text"}>{token.symbol}</div>
            </td>
            <td className={"market__table-td market__table-text"}>
              {renderRate(token.sellRate, token.sellRateUsd)}
            </td>
            <td className={"market__table-td market__table-text"}>
              {renderRate(token.buyRate, token.buyRateUsd)}
            </td>
            <td className={"market__table-td market__table-last-col"}>
              <span className={"market__table-change none"}>---</span>
            </td>
          </tr>
        )
      });
    };

    const renderRate = (tokenBasedRate, usdRate) => {
      let rate = tokenBasedRate;

      if (this.props.indexToken.id === envConfig.USD.id) {
        rate = usdRate;
      }

      return <div className={"market__table-text"}>{rate ? formatAmount(rate) : 0}</div>
    };

    const getSortingClass = (sortKey) => {
      if (this.props.sortKey !== sortKey) {
        return '';
      }

      return ` ${this.props.sortDirection}`;
    };

    return (
      <div className={"market"}>
        <div className={"market__header common__flexbox"}>
          <div className={"market__header-title"}>{this.props.indexToken.name} Market</div>
          <div className={"market__header-input"}>
            <input type="text" placeholder="Search" value={this.props.searchText} onChange={(e) => this.props.onTypingSearch(e)}/>
          </div>
        </div>

        <div className={"market__table-container"}>
          <table className={"market__table"}>
            <tbody>
            <tr>
              <th className={"market__table-select"}>
                {this.props.isBackgroundLoading && (
                  <div className={"market__table-bg-loading common__fade-in"}/>
                )}
                {appConfig.MARKET_BASED_TOKENS.map((basedToken, index) => {
                  return (
                    <div
                      key={index}
                      className={`market__table-option ${this.props.indexToken.id === basedToken.id ? 'active' : ''}`}
                      onClick={() => this.props.onClickBasedToken(basedToken)}
                    >
                      {basedToken.symbol}
                    </div>
                  )
                })}
              </th>
              <th className={`market__table-header ${getSortingClass('sellRate')}`} onClick={() => this.props.activateSorting('sellRate')}>Sell Price</th>
              <th className={`market__table-header ${getSortingClass('buyRate')}`} onClick={() => this.props.activateSorting('buyRate')}>Buy Price</th>
              <th className={"market__table-header disabled"}>24hr Change</th>
            </tr>
            {!this.props.isLoading && (
              getTokenList()
            )}
            </tbody>
          </table>
        </div>

        {this.props.isLoading && (
          <div className={"market__loading"}>
            <div>Fetching market rates...</div>
            <div className={"common__loading"}/>
          </div>
        )}
      </div>
    )
  }
}
