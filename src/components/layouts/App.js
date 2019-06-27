import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import React, { Component } from 'react';
import './../../assets/scss/index.scss';

export default class App extends Component {
  changeRouteParams = (srcSymbol, destSymbol) => {
    this.props.history.push(`/swap/${srcSymbol}-${destSymbol}`);
  };

  render() {
    const params = this.props.match.params;

    return (
      <div>
        <Header/>
        <Body
          srcSymbolParam={params.srcSymbol}
          destSymbolParam={params.destSymbol}
          changeRouteParams={this.changeRouteParams}
        />
        <Footer/>
      </div>
    )
  }
}
