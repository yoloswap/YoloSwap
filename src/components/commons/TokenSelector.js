import React, { Component } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";

export default class TokenSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      searchText: ''
    }
  }

  handleOpenDropDown = () => {
    this.setState({ isOpen: true })
  };

  handleCloseDropDown = () => {
    this.setState({ isOpen: false })
  };

  handleOnTypingSearch = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ searchText: value });
  };

  handleOnClickToken = (tokenName) => {
    this.props.onSelectedToken(tokenName);
    this.handleCloseDropDown();
  };

  render() {
    const getTokenList = () => {
      return this.props.tokens.filter((token) => {
        return token.name.includes(this.state.searchText);
      }).map((token, index) =>
        <div className={"token-selector__item"} key={index} onClick={() => this.handleOnClickToken(token.name)}>
          <div className={"token-selector__item-symbol"}>{token.name}</div>
          {(this.props.showBalance && token.balance >= 0) && (
            <div className={"token-selector__item-balance"}>{token.balance} {token.name}</div>
          )}
        </div>
      );
    };

    return (
      <div className={"token-selector"}>
        <Dropdown onShow={() => this.handleOpenDropDown()} onHide={() => this.handleCloseDropDown()} active={this.state.isOpen}>
          <DropdownTrigger>
            <div className={"token-selector__active"}>
              <img className={"token-selector__active-icon"} src={require("../../assets/images/tokens/eos.svg")} alt=""/>
              <div className={"token-selector__active-symbol"}>{this.props.selectedToken}</div>
              <div className={'common__arrow-drop-down ' + (this.state.isOpen ? 'up' : 'down')}/>
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <div className={"token-selector__container"}>
              <div className={"token-selector__input-container"}>
                <input className={"token-selector__input"} placeholder='Search' type="text" value={this.state.searchText} onChange={(e) => this.handleOnTypingSearch(e)}/>
              </div>
              <div className={"token-selector__item-container"}>
                {getTokenList()}
              </div>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    )
  }

}
