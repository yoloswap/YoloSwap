import React, { Component } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";

export default class TokenSelector extends Component {
  constructor(props) {
    super(props);

    this.searchTokenInputRef = React.createRef();

    this.state = {
      isOpen: false,
      searchText: ''
    }
  }

  handleOpenDropDown = () => {
    this.setState({ isOpen: true });
    setTimeout(() => this.searchTokenInputRef.current.focus(), 0);
  };

  handleCloseDropDown = () => {
    this.setState({
      isOpen: false,
      searchText: ''
    });
  };

  handleOnTypingSearch = (e) => {
    const value = e.target.value.toUpperCase();
    this.setState({ searchText: value });
  };

  handleOnClickToken = (token) => {
    this.props.onSelectedToken(token);
    this.handleCloseDropDown();
  };

  handleOnKeyUp = (e, firstToken) => {
    if (e.key === 'Enter' && firstToken) {
      this.handleOnClickToken(firstToken)
    }
  };

  render() {
    const filteredTokens = this.props.tokens.filter((token) => {
      return token.symbol.includes(this.state.searchText);
    });

    return (
      <div className={"token-selector"}>
        <Dropdown onShow={() => this.handleOpenDropDown()} onHide={() => this.handleCloseDropDown()} active={this.state.isOpen}>
          <DropdownTrigger>
            <div className={"token-selector__active"}>
              <img className={"token-selector__active-icon"} src={require(`../../assets/images/tokens/${this.props.selectedToken.logo}`)} alt=""/>
              <div className={"token-selector__active-symbol"}>{this.props.selectedToken.symbol}</div>
              <div className={'common__arrow-drop-down ' + (this.state.isOpen ? 'up' : 'down')}/>
            </div>
          </DropdownTrigger>
          <DropdownContent className={"common__fade-in"}>
            <div className={"token-selector__container"}>
              <div className={"token-selector__input-container"}>
                <input
                  className={"token-selector__input"}
                  ref={this.searchTokenInputRef}
                  placeholder='Search'
                  type="text"
                  value={this.state.searchText}
                  onChange={this.handleOnTypingSearch}
                  onKeyUp={(e) => this.handleOnKeyUp(e, filteredTokens[0])}
                />
              </div>
              <div className={"token-selector__item-container"}>
                {filteredTokens.map((token, index) =>
                  <div className={"token-selector__item"} key={index} onClick={() => this.handleOnClickToken(token)}>
                    <div className={"token-selector__item-symbol"}>{token.symbol}</div>
                    {(this.props.showBalance && token.balance >= 0) && (
                      <div className={"token-selector__item-balance"}>{token.balance}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    )
  }
}
