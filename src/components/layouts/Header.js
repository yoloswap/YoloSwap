import React, { Component } from 'react'
import { connect } from "react-redux";
import * as accountAction from "../../actions/accountAction";
// import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";

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
      isOpenAccount: false
    }
  }

  handleOpenAccountDropDown = () => {
    this.setState({ isOpenAccount: true })
  };

  handleCloseAccountDropDown = () => {
    this.setState({ isOpenAccount: false })
  };

  signInToScatter = () => {
    this.props.connectToScatter();
  };

  signOutFromScatter = () => {
    this.props.disconnectFromScatter();
  };

  render() {
    return (
      <div className={"header"}>
        <div className={"header__container container"}>
          <div className={"header__logo"}/>
          <div className={"header__content"}>
            <a href="/" className={"header__content-item"}>YOLO</a>
            <a href="/" className={"header__content-item"}>FAQ</a>
            <a href="/" className={"header__content-item"}>CONTACT US</a>
            <a href="/" className={"header__content-item"}>BLOG</a>
            {!this.props.account && (
              <div className={"header__content-button common__button"} onClick={() => this.signInToScatter()}>Sign In</div>
            )}

            {this.props.account && (
              <div className={"header__content-account"}>
                <div className={"header__content-name"} onClick={() => this.signOutFromScatter()}>
                  {this.props.account.name}
                </div>
                {/*<Dropdown*/}
                {/*onShow={() => this.handleOpenAccountDropDown()}*/}
                {/*onHide={() => this.handleCloseAccountDropDown()}*/}
                {/*active={this.state.isOpenAccount}*/}
                {/*>*/}
                {/*<DropdownTrigger className={"header__content-account"}>*/}
                {/*<div className={"header__content-name"}>{this.props.account.name}</div>*/}
                {/*<div className={`header__content-arrow common__arrow-drop-down grey ${this.state.isOpenAccount ? 'up' : 'down'}`}/>*/}
                {/*</DropdownTrigger>*/}
                {/*<DropdownContent>*/}
                {/*<div>Transaction history</div>*/}
                {/*<div onClick={() => this.signOutFromScatter()}>Log Out</div>*/}
                {/*</DropdownContent>*/}
                {/*</Dropdown>*/}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
