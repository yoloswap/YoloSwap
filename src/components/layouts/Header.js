import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import * as accountAction from "../../actions/accountAction";
import Dropdown, { DropdownTrigger, DropdownContent } from "react-simple-dropdown";
import Modal from '../commons/Modal';
import { formatHash } from "../../utils/helpers";
import envConfig from "../../config/env";

function mapStateToProps(store) {
  const account = store.account;
  const transaction = store.transaction;

  return {
    account: account.account,
    txHistory: transaction.txHistory
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
      isTxModalOpened: false,
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

  openTxModal = () => {
    this.setState({ isTxModalOpened: true });
  };

  closeTxModal = () => {
    this.setState({ isTxModalOpened: false });
  };

  render() {
    const isTxHistoryEmpty = this.props.txHistory.length === 0;

    return (
      <Fragment>
        <div className={"header"}>
          <div className={`header__container container ${this.state.isMobileMenuActive ? 'active' : ''}`}>
            <div className={"header__logo"}/>
            <div className={"header__mobile-opener"} onClick={() => this.handleToggleMobileMenu()}>
              <div className={"header__mobile-opener-bar"}/>
              <div className={"header__mobile-opener-bar"}/>
            </div>
            <div className={"header__content"}>
              <a href="/" className={"header__content-item active"}>YOLO</a>
              <a className={"header__content-item"} href="mailto:hello@yoloswap.com" target="_top">CONTACT US</a>
              <a className={"header__content-item"} href="https://medium.com/hello-yolo" target="_blank" rel="noopener noreferrer">BLOG</a>

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
                      <div onClick={() => this.openTxModal()} className={"header__content-dropdown-text"}>Transaction History</div>
                      <div className={"header__content-dropdown-bot"} onClick={() => this.signOutFromScatter()}>Log Out</div>
                    </DropdownContent>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </div>

        <Modal isActive={this.state.isTxModalOpened} handleClose={() => this.closeTxModal()} title="Transaction History">
          {!isTxHistoryEmpty && (
            <div className={"transaction"}>
              {this.props.txHistory.map((tx, index) => {
                return (
                  <div className={"transaction__item"} key={index}>
                    <div className={"transaction__item-head"}>
                      <div className={"transaction__item-action"}>{tx.type}</div>
                      <div className={"transaction__item-value"}>{tx.srcAmount} {tx.srcSymbol} -> {tx.destAmount} {tx.destSymbol}</div>
                    </div>
                    <div className={"transaction__item-body"}>
                      <a className={"transaction__item-hash"} href={`${envConfig.TX_URL}${tx.hash}`} target="_blank" rel="noopener noreferrer">{formatHash(tx.hash)}</a>
                      <div className={`transaction__item-status transaction__item-status--${tx.status}`}>{tx.status}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {isTxHistoryEmpty && (
            <div className={"transaction transaction--empty"}>No transactions made</div>
          )}
        </Modal>
      </Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
