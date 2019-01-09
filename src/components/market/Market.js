import React, { Component } from 'react';
import MarketView from './MarketView';
import { connect } from "react-redux";
import { account } from "../../account";
import { MARKET_BASED_TOKENS} from "../../constants";
import { fetchMarketRates, setMarketBasedToken } from "../../actions/tokenAction";

function mapStateToProps(store) {
  return {
    tokens: store.token.list,
    marketBasedToken: store.token.marketBasedToken,
    isMarketLoading: store.token.isMarketLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMarketRates: (eos, srcSymbols, destSymbols, srcAmounts) => {dispatch(fetchMarketRates(eos, srcSymbols, destSymbols, srcAmounts))},
    setMarketBasedToken: (token) => {dispatch(setMarketBasedToken(token))},
  }
}

class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      basedTokens: MARKET_BASED_TOKENS
    }
  }

  componentDidMount() {
    let srcSymbols = [];
    let destSymbols = [];
    let srcAmounts = [];

    this.props.tokens.forEach((token) => {
      srcSymbols.push(token.name);
      destSymbols.push(this.props.marketBasedToken);
      srcAmounts.push(1);
    });

    this.props.fetchMarketRates(account.eos, srcSymbols, destSymbols, srcAmounts);
  }

  handleOnTypingSearch = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ searchText: value });
  };

  render() {
    return (
      <MarketView
        tokens={this.props.tokens}
        searchText={this.state.searchText}
        basedTokens={this.state.basedTokens}
        marketBasedToken={this.props.marketBasedToken}
        isMarketLoading={this.props.isMarketLoading}
        onClickBasedToken={this.props.setMarketBasedToken}
        onTypingSearch={this.handleOnTypingSearch}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
