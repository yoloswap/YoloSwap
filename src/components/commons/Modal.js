import React, { PureComponent } from "react";

export default class Modal extends PureComponent {
  handleClose = (e) => {
    if(e.target === e.currentTarget) {
      this.props.handleClose();
    }
  };

  render() {
    return (
      <div className={"modal-overlay" + (this.props.isActive ? " modal-overlay--active" : "")} onClick={this.handleClose}>
        <div className={`modal ${this.props.isActive ? "modal--active" : ""} ${this.props.widgetMode ? "modal--widget" : ""}`} style={this.props.maxWidth ? {maxWidth: `${this.props.maxWidth}px`} : {}}>
          <div className={"modal__content"}>
            <div className={"modal__header"}>
              <div className={"modal__close-btn"} onClick={this.handleClose}>×</div>
              <div>{this.props.title}</div>
             </div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
