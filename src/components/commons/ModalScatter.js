import React, { Component } from 'react';

class ModalScatter extends Component {
  render() {
    return (
      <div className={"error-modal__message"}>
        You might not have Scatter installed! Please download them from one of these following links and refresh the page.
        <div className="error-modal__container">
          <div className="error-modal__content">
            <span>Download</span>
            <a href="https://chrome.google.com/webstore/detail/scatter/ammjpmhgckkpcamddpolhchgomcojkle" target="_blank" rel="noopener noreferrer"> Scatter Chrome Extension</a>
            <span> or</span>
            <a href="https://get-scatter.com/" target="_blank" rel="noopener noreferrer"> Scatter Desktop</a>
          </div>
        </div>
      </div>
    )
  }
}

export default ModalScatter;
