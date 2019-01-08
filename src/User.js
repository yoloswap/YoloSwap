import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import React from 'react';
import {chains} from './constants.js';
// import Eos from 'eosjs';

class User extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        accounts: []
      }
  }

  componentDidMount(){
    ScatterJS.plugins( new ScatterEOS() );
    window.ScatterJS = null;

    const network = {
      blockchain:'eos',
      protocol:'https',
      host:'nodes.get-scatter.com',
      port:443,
      chainId: chains.jungle.id
    }

    // First we need to connect to the user's Scatter.
    ScatterJS.scatter.connect('Yolo by Kyber').then(connected => {

      // If the user does not have Scatter or it is Locked or Closed this will return false;
      // TODO: register the error here to state to display to users
      if(!connected) return false;

      const scatter = ScatterJS.scatter;

      // Now we need to get an identity from the user.
      // We're also going to require an account that is connected to the network we're using.
      const requiredFields = { accounts:[network] };
      if (scatter.identity) {
        console.log(scatter.identity)
      }
      scatter.getIdentity(requiredFields).then(() => {

          // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
          // the user for their account name beforehand. They could still give you a different account.
          const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
          console.log(account)
          this.setState({
            accounts: [account]
          })
          // You can pass in any additional options you want into the eosjs reference.
          // const eosOptions = { expireInSeconds:60 };

          // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
          // const eos = scatter.eos(network, Eos, eosOptions);
          // ----------------------------
          // Now that we have an identity,
          // an EOSIO account, and a reference
          // to an eosjs object we can send a transaction.
          // ----------------------------


          // Never assume the account's permission/authority. Always take it from the returned account.
          // const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };

          // eos.transfer(account.name, 'helloworld', '1.0000 EOS', 'memo', transactionOptions).then(trx => {
                // That's it!
          //     console.log(`Transaction ID: ${trx.transaction_id}`);
          // }).catch(error => {
          //     console.error(error);
          // });

      }).catch(error => {
          // The user rejected this request, or doesn't have the appropriate requirements.
          console.error(error);
      });
    });
  }

  render() {
    if (this.state.accounts.len === 0) {
      return <div>Connecting to scatter...</div>
    } else {
      const accounts = this.state.accounts.map((account, i) =>
        <p key={i}>{account.name}</p>
      )
      return (
        <div>
          {accounts}
        </div>
      )
    }
  }
}

export { User };
