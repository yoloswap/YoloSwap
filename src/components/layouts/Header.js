import React from 'react'

const Header = () => (
  <div className={"header"}>
    <div className={"header__container container"}>
      <div className={"header__logo"}/>
      <div className={"header__content"}>
        <a href="#" className={"header__content-item"}>YOLO</a>
        <a href="#" className={"header__content-item"}>FAQ</a>
        <a href="#" className={"header__content-item"}>CONTACT US</a>
        <a href="#" className={"header__content-item"}>BLOG</a>
        <a href="#" className={"header__content-item common__button"}>Sign In</a>
      </div>
    </div>
  </div>
);

export default Header
