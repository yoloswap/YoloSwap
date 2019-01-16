import React, { Component } from 'react'
import { connect } from "react-redux";
import * as accountAction from "../../actions/accountAction";
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";

function mapStateToProps(store) {
  const account = store.account;

  return {
    account: account.account
  };
}

function mapDispatchToProps(dispatch) {
  return {
    connectToScatter: () => {dispatch(accountAction.connectToScatter())},
    disconnectFromScatter: () => {dispatch(accountAction.disconnectFromScatter())},
  }
}

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAccountActive: false,
      isMobileMenuActive: false,
    }
  }

  handleOpenAccountDropDown = () => {
    this.setState({ isAccountActive: true })
  };

  handleCloseAccountDropDown = () => {
    this.setState({ isAccountActive: false })
  };

  handleToggleMobileMenu = () => {
    this.setState({ isMobileMenuActive: !this.state.isMobileMenuActive })
  };

  handleCloseMobileMenu = () => {
    this.setState({ isMobileMenuActive: false })
  };

  signInToScatter = () => {
    this.props.connectToScatter();
    this.handleCloseMobileMenu();
  };

  signOutFromScatter = () => {
    this.props.disconnectFromScatter();
    this.handleCloseAccountDropDown();
    this.handleCloseMobileMenu();
  };

  render() {
    return (
      <div className={"header"}>
        <div className={`header__container container ${this.state.isMobileMenuActive ? 'active' : ''}`}>
          <div className={"header__logo"}/>
          <div className={"header__mobile-opener"} onClick={() => this.handleToggleMobileMenu()}>
            <div className={"header__mobile-opener-bar"}/>
            <div className={"header__mobile-opener-bar"}/>
          </div>
          <div className={"header__content"}>
            <a href="/" className={"header__content-item active"}>YOLO</a>
            <a href="/" className={"header__content-item"}>FAQ</a>
            <a href="/" className={"header__content-item"}>CONTACT US</a>
            <a href="/" className={"header__content-item"}>BLOG</a>

            {!this.props.account && (
              <div className={"header__content-button common__button"} onClick={() => this.signInToScatter()}>Sign In</div>
            )}

            {this.props.account && (
              <div className={"header__content-account"}>
                <Dropdown
                  onShow={() => this.handleOpenAccountDropDown()}
                  onHide={() => this.handleCloseAccountDropDown()}
                  active={this.state.isAccountActive}
                >
                  <DropdownTrigger className={"common__flexbox"}>
                    <div className={"header__content-name"}>{this.props.account.name}</div>
                    <div className={`header__content-arrow common__arrow-drop-down grey ${this.state.isAccountActive ? 'up' : 'down'}`}/>
                  </DropdownTrigger>
                  <DropdownContent className={"header__content-dropdown common__fade-in"}>
                    <div className={"header__content-dropdown-text"}>Transaction history</div>
                    <div className={"header__content-dropdown-bot"} onClick={() => this.signOutFromScatter()}>Log Out</div>
                  </DropdownContent>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
