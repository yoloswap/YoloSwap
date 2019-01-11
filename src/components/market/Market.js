import React, { Component } from 'react';
import MarketView from './MarketView';
import { connect } from "react-redux";
import { MARKET_BASED_TOKENS} from "../../config/app";
import { fetchMarketRates, setIndexToken } from "../../actions/marketAction";

function mapStateToProps(store) {
  return {
    tokens: store.token.tokens,
    indexToken: store.market.indexToken,
    isLoading: store.market.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMarketRates: () => { dispatch(fetchMarketRates()) },
    setindexToken: (token) => { dispatch(setIndexToken(token)) },
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
        indexToken={this.props.indexToken}
        isLoading={this.props.isLoading}
        onClickBasedToken={this.props.setindexToken}
        onTypingSearch={this.handleOnTypingSearch}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
