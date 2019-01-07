import React from 'react'

const Footer = () => (
  <div className={"footer"}>
    <div className={"footer__container"}>
      <div className={"container common__flexbox"}>
        <div className={"footer__content"}>
          <a href="#" className={"footer__content-item"}>Yolo</a>
          <a href="#" className={"footer__content-item"}>FAQ</a>
          <a href="#" className={"footer__content-item"}>Contact Us</a>
          <a href="#" className={"footer__content-item"}>KYC</a>
          <a href="#" className={"footer__content-item"}>Blog</a>
        </div>

        <div className={"footer__logo"}>
          <a href="#" className={"footer__logo-item telegram"}/>
          <a href="#" className={"footer__logo-item twitter"}/>
          <a href="#" className={"footer__logo-item reddit"}/>
          <a href="#" className={"footer__logo-item medium"}/>
        </div>
      </div>
    </div>

    <div className={"footer__copyright"}>@ 2019 Kyber Network. All rights reserved.</div>
  </div>
);

export default Footer
