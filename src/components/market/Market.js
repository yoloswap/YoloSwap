import React, { Component } from 'react';
import MarketView from './MarketView';
import { connect } from "react-redux";
import { fetchMarketRates, setIndexToken } from "../../actions/marketAction";

function mapStateToProps(store) {
  return {
    tokens: store.token.tokens,
    indexToken: store.market.indexToken,
    isLoading: store.market.isLoading,
    isBackgroundLoading: store.market.isBackgroundLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMarketRates: () => { dispatch(fetchMarketRates()) },
    setIndexToken: (token) => { dispatch(setIndexToken(token)) },
  }
}

class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      sortDirection: '',
      sortKey: ''
    }
  };

  componentDidMount() {
    this.props.fetchMarketRates();
  };

  handleOnTypingSearch = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ searchText: value });
  };

  activateSorting = (sortKey) => {
    this.setState({ sortKey: sortKey });
    this.toggleSortDirection();
  };

  toggleSortDirection = () => {
    if (this.state.sortDirection === 'asc') {
      this.setState({ sortDirection: 'desc' });
    } else {
      this.setState({ sortDirection: 'asc' });
    }
  };

  render() {
    return (
      <MarketView
        tokens={this.props.tokens}
        searchText={this.state.searchText}
        indexToken={this.props.indexToken}
        isLoading={this.props.isLoading}
        isBackgroundLoading={this.props.isBackgroundLoading}
        sortDirection={this.state.sortDirection}
        sortKey={this.state.sortKey}
        activateSorting={this.activateSorting}
        onClickBasedToken={this.props.setIndexToken}
        onTypingSearch={this.handleOnTypingSearch}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
