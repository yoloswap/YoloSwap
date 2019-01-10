import React, { Component } from 'react';
import MarketView from './MarketView';
import { connect } from "react-redux";
import { MARKET_BASED_TOKENS} from "../../config/app";
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
    fetchMarketRates: () => { dispatch(fetchMarketRates()) },
    setMarketBasedToken: (token) => { dispatch(setMarketBasedToken(token)) },
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
    this.props.fetchMarketRates();
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
