import React, { Component } from "react";

export default class Modal extends Component {
  handleClose = (e) => {
    if(e.target === e.currentTarget) {
      this.props.handleClose();
    }
  };

  render() {
    return (
      <div className={"modal-overlay" + (this.props.isActive ? " modal-overlay--active" : "")} onClick={this.handleClose}>
        <div className={"modal" + (this.props.isActive ? " modal--active" : "")}>
          <div className={"modal__content"}>
            <div className={"modal__header"}>{this.props.title}</div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
