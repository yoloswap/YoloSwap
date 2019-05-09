import React from 'react'

const Footer = () => (
  <div className={"footer"}>
    <div className={"footer__container"}>
      <div className={"container common__flexbox"}>
        <div className={"footer__content"}>
          <a href="/" className={"footer__content-item"}>Yolo</a>
          <a className={"footer__content-item"} href="mailto:hello@yoloswap.com" target="_top">Contact Us</a>
          <a className={"footer__content-item"} href="https://medium.com/hello-yolo" target="_blank" rel="noopener noreferrer">Blog</a>
          <a className={"footer__content-item"} href="https://docs.google.com/document/d/19xGm8IZVn2wyImUnWD-TOXO6MJbICXTc_rwsV-aOv3A/edit" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </div>

        <div className={"footer__logo"}>
          <a href="https://t.me/yoloswaps" target="_blank" rel="noopener noreferrer">
            <span className={"footer__logo-item telegram"}/>
          </a>
          <a href="https://twitter.com/YoloSwap" target="_blank" rel="noopener noreferrer">
            <span className={"footer__logo-item twitter"}/>
          </a>
          <a href="https://www.reddit.com/user/YOLOSwaps" target="_blank" rel="noopener noreferrer">
            <span className={"footer__logo-item reddit"}/>
          </a>
          <a href="https://medium.com/hello-yolo" target="_blank" rel="noopener noreferrer">
            <span className={"footer__logo-item medium"}/>
          </a>
        </div>
      </div>
    </div>

    <div className={"footer__copyright"}>@ 2019 Kyber Network. All rights reserved.</div>
  </div>
);

export default Footer
