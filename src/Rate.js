import React from 'react';
import {getRate} from './services/network_service';
import {EOS_TOKEN} from './tokens/Tokens.js';
import {NETWORK_ACCOUNT} from './constants.js'
import {account} from './account.js'

class Rate extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          token: this.props.token,
          rate: null
        }
    }

    componentDidMount(){
      getRate(
        {
          eos: account.eos,
          srcSymbol: this.state.token.name,
          destSymbol: EOS_TOKEN.name,
          srcAmount: 1,
          networkAccount: NETWORK_ACCOUNT,
          eosTokenAccount: EOS_TOKEN.account
        }
      ).then((rate) => {
          this.setState({
              rate: rate
          });
      })
    }

    render(){
      if (this.state.rate == null) {
        return (
          <p>
            {this.state.token.name}/EOS - price(loading...)
          </p>
        )
      } else {
        return (
          <p>
            {this.state.token.name}/EOS - price({this.state.rate})
          </p>
        );
      }
    }
}

export { Rate };
