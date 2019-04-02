import React, { Component } from 'react';
import { connect } from "react-redux";
import * as accountAction from "../../actions/accountAction";
import * as globalActions from "../../actions/globalAction";

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    connectToScatter: () => {dispatch(accountAction.connectToScatter())},
    unsetGlobalError: () => {dispatch(globalActions.setGlobalError(false))},
  }
}

class ModalScatter extends Component {
  signInToScatter = () => {
    this.props.unsetGlobalError();
    this.props.connectToScatter();
  };

  render() {
    return (
      <div className={"error-modal__message"}>
        You might not have Scatter installed!
        <div className="error-modal__container">
          <div className="error-modal__content">
            <span>Download</span>
            <a href="https://chrome.google.com/webstore/detail/scatter/ammjpmhgckkpcamddpolhchgomcojkle" target="_blank" rel="noopener noreferrer"> Scatter Chrome Extension</a>
            <span> or</span>
            <a href="https://get-scatter.com/" target="_blank" rel="noopener noreferrer"> Scatter Desktop</a>
          </div>
          <div className="error-modal__button common__button common__button--blue" onClick={() => this.signInToScatter()}>Try Again</div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalScatter);
