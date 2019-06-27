import React, { Component } from 'react';
import MarketView from './MarketView';
import { connect } from "react-redux";
import { fetchMarketRates, setIndexToken } from "../../actions/marketAction";
import * as swapActions from "../../actions/swapAction";
import appConfig from "../../config/app";

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
    setIndexToken: (token) => { dispatch(setIndexToken(token)) },
    setSourceAndDestToken: (srcToken, destToken) => { dispatch(swapActions.setSourceAndDestToken(srcToken, destToken)) },
    setSourceAmount: (amount) => { dispatch(swapActions.setSourceAmount(amount)) },
  }
}

class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: ''
    };
  };

  componentDidMount() {
    this.props.fetchMarketRates();
  };

  handleOnTypingSearch = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ searchText: value });
  };

  setSourceAndDestToken = (srcToken, destToken) => {
    this.props.setSourceAndDestToken(srcToken, destToken);
    this.props.srcAmountRef.current.focus();

    window.scrollTo(0, 0);

    this.props.changeRouteParams(srcToken.symbol, destToken.symbol);
  };

  checkNewToken = (listingTime) => {
    const listingDate = new Date(listingTime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - listingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= appConfig.NEW_LISTING_TOKEN_DAYS;
  };

  render() {
    return (
      <MarketView
        tokens={this.props.tokens}
        searchText={this.state.searchText}
        indexToken={this.props.indexToken}
        isLoading={this.props.isLoading}
        onClickBasedToken={this.props.setIndexToken}
        onTypingSearch={this.handleOnTypingSearch}
        setSourceAndDestToken={this.setSourceAndDestToken}
        checkNewToken={this.checkNewToken}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
