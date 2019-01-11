import React, { Component } from 'react';
import Swap from '../swap/Swap';
import Market from '../market/Market';
import * as accountAction from "../../actions/accountAction";
import { connect } from "react-redux";
import * as scatterService from '../../services/scatter_service';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setScatterEos: (eos) => {dispatch(accountAction.setScatterEos(eos))}
  }
}

class Body extends Component {
  componentWillMount = () => {
    const scatter = scatterService.initiateScatter();
    const eos = scatterService.getEosInstance(scatter);

    this.props.setScatterEos(eos);
  };

  render() {
    return (
      <div className={"body"}>
        <div className={"container"}>
          <div className={"body__title"}>No Deposit, No Orderbook, Competitive Spreads</div>
          <div className={"body__sub-title"}>A simple way to exchange tokens. Over 70 tokens supported</div>
          <Swap/>
          <Market/>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);
