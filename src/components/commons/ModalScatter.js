import React, { Component } from 'react';

class ModalScatter extends Component {
  render() {
    return (
      <div className={"error-modal__message"}>
        You might not have Scatter installed! Please download Scatter <a href="https://get-scatter.com/" target="_blank" rel="noopener noreferrer">here</a> and refresh the page.
      </div>
    )
  }
}

export default ModalScatter;
