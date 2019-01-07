import React, { Component } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";

export default class TokenSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
  }

  handleOpenDropDown = () => {
    this.setState({ isOpen: true })
  };

  handleCloseDropDown = () => {
    this.setState({ isOpen: false })
  };

  render() {
    return (
      <div className={"token-selector"}>
        <Dropdown onShow={() => this.handleOpenDropDown()} onHide={() => this.handleCloseDropDown()} active={this.state.isOpen}>
          <DropdownTrigger>
            <div className={"token-selector__active"}>
              <img className={"token-selector__active-icon"} src={require("../../assets/images/tokens/eos.svg")} alt=""/>
              <div className={"token-selector__active-symbol"}>EOS</div>
              <div className={'common__arrow-drop-down ' + (this.state.isOpen ? 'up' : 'down')}/>
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <div className={"token-selector__container"}>
              <div className={"token-selector__input-container"}>
                <input className={"token-selector__input"} placeholder='Search' type="text"/>
              </div>
              <div className={"token-selector__item-container"}>
                <div className={"token-selector__item"}>
                  <div className={"token-selector__item-symbol"}>KNC</div>
                  <div className={"token-selector__item-balance"}>12.3876 KNC</div>
                </div>
                <div className={"token-selector__item"}>
                  <div className={"token-selector__item-symbol"}>DAN</div>
                  <div className={"token-selector__item-balance"}>77.0009 DAN</div>
                </div>
                <div className={"token-selector__item"}>
                  <div className={"token-selector__item-symbol"}>NET</div>
                  <div className={"token-selector__item-balance"}>1120.1312 NET</div>
                </div>
                <div className={"token-selector__item"}>
                  <div className={"token-selector__item-symbol"}>ONG</div>
                  <div className={"token-selector__item-balance"}>0 ONG</div>
                </div>
              </div>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    )
  }

}
