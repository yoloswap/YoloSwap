import React, { Component } from 'react';

export default class MarketView extends Component {
  render() {
    const getTokenList = () => {
      return this.props.tokens.filter((token) => {
        return token.name.includes(this.props.searchText) && !token.name.includes(this.props.indexToken);
      }).map((token, index) =>
        <tr key={index} className={"common__fade-in"}>
          <td className={"common__flexbox none"}>
            <img className={"market__table-icon"} src={require("../../assets/images/tokens/eos.svg")} alt=""/>
            <div className={"market__table-text"}>{token.name}/{this.props.indexToken}</div>
          </td>
          <td className={"market__table-text"}>{token.sellRate ? token.sellRate.toFixed(6) : 0} {this.props.indexToken}</td>
          <td className={"market__table-text"}>{token.buyRate ? token.buyRate.toFixed(6) : 0} {this.props.indexToken}</td>
          <td>
            <span className={"market__table-change none"}>---</span>
          </td>
        </tr>
      );
    };

    return (
      <div className={"market"}>
        <div className={"market__header common__flexbox"}>
          <div className={"market__header-title"}>{this.props.indexToken} Market</div>
          <div className={"market__header-input"}>
            <input type="text" placeholder="Search" value={this.props.searchText} onChange={(e) => this.props.onTypingSearch(e)}/>
          </div>
        </div>

        <div className={"market__table-container"}>
          <table className={"market__table"}>
            <tbody>
            <tr>
              <th className={"market__table-select common__flexbox"}>
                {this.props.basedTokens.map((basedToken, index) => {
                  return (
                    <div
                      key={index}
                      className={`market__table-option ${this.props.indexToken === basedToken ? 'active' : 'disabled'}`}
                      onClick={() => this.props.onClickBasedToken(basedToken)}>
                      {basedToken}
                    </div>
                  )
                })}
              </th>
              <th className={"market__table-header"}>Sell Price</th>
              <th className={"market__table-header"}>Buy Price</th>
              <th className={"market__table-header"}>24hr Change</th>
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
