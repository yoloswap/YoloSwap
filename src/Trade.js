import React from 'react';
import {trade} from './services/network_service';
import {account} from './account.js';
import {NETWORK_ACCOUNT} from './constants.js';

class TradeDemo extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          waiting: true,
        }
    }

    componentDidMount(){
      console.log(account.eos)
      // send({
      //   eos: account.eos,
      //   userAccount: account.account,
      //   srcAmount: "1.5",
      //   srcSymbol: "EOS",
      //   toAccount: "lionofcourse"
      // }).then((result) => {
      //   console.log(result)
      //   this.setState({
      //     waiting: false
      //   });
      // })
      trade({
        eos: account.eos,
        networkAccount: NETWORK_ACCOUNT,
        userAccount: account.account,
        srcAmount: "1.5000",
        srcPrecision: 4,
        srcTokenAccount: 'eosio.token',
        srcSymbol: "EOS",
        destPrecision:4,
        destSymbol: "SYS",
        destAccount: account.account,
        destTokenAccount: 'testtokeaaaa',
        maxDestAmount: 1000000000,
        minConversionRate: "0.000001",
        walletId: account.account,
        hint:""
      }).then((result) => {
        console.log(result)
        this.setState({
          waiting: false
        });
      })
    }

    render(){
      if (this.state.waiting) {
        return (
          <p>Doing trade...</p>
        )
      } else {
        return (
          <p>Done...</p>
        )
      }
    }
}

export { TradeDemo };
