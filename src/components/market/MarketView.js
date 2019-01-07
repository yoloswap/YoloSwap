import React from 'react';

const MarketView = () => (
  <div className={"market"}>
    <div className={"market__header common__flexbox"}>
      <div className={"market__header-title"}>Eos Market</div>
      <div className={"market__header-input"}>
        <input type="text" placeholder="Search"/>
      </div>
    </div>

    <table className={"market__table"}>
      <tbody>
        <tr>
          <th className={"market__table-select common__flexbox"}>
            <div className={"market__table-option active"}>EOS</div>
            <div className={"market__table-option"}>USD</div>
          </th>
          <th className={"market__table-header"}>Sell Price</th>
          <th className={"market__table-header"}>Buy Price</th>
          <th className={"market__table-header"}>24hr Change</th>
        </tr>
        <tr>
          <td className={"common__flexbox none"}>
            <img className={"market__table-icon"} src={require("../../assets/images/tokens/eos.svg")}/>
            <div className={"market__table-text"}>XMR/ETH</div>
          </td>
          <td className={"market__table-text"}>0.009739 ETH</td>
          <td className={"market__table-text"}>0.007812 ETH</td>
          <td>
            <span className={"market__table-change up"}>6.30%</span>
          </td>
        </tr>
        <tr>
          <td className={"common__flexbox none"}>
            <img className={"market__table-icon"} src={require("../../assets/images/tokens/eos.svg")}/>
            <div className={"market__table-text"}>OMG/ETH</div>
          </td>
          <td className={"market__table-text"}>0.009739 ETH</td>
          <td className={"market__table-text"}>0.009739 ETH</td>
          <td>
            <span className={"market__table-change up"}>6.30%</span>
          </td>
        </tr>
        <tr>
          <td className={"common__flexbox none"}>
            <img className={"market__table-icon"} src={require("../../assets/images/tokens/eos.svg")}/>
            <div className={"market__table-text"}>KNC/ETH</div>
          </td>
          <td className={"market__table-text"}>0.007812 ETH</td>
          <td className={"market__table-text"}>0.009739 ETH</td>
          <td>
            <span className={"market__table-change up"}>6.30%</span>
          </td>
        </tr>
        <tr>
          <td className={"common__flexbox none"}>
            <img className={"market__table-icon"} src={require("../../assets/images/tokens/eos.svg")}/>
            <div className={"market__table-text"}>SNT/ETH</div>
          </td>
          <td className={"market__table-text"}>0.007812 ETH</td>
          <td className={"market__table-text"}>0.009739 ETH</td>
          <td>
            <span className={"market__table-change down"}>6.30%</span>
          </td>
        </tr>
        <tr>
          <td className={"common__flexbox none"}>
            <img className={"market__table-icon"} src={require("../../assets/images/tokens/eos.svg")}/>
            <div className={"market__table-text"}>TOMO/ETH</div>
          </td>
          <td className={"market__table-text"}>0.007812 ETH</td>
          <td className={"market__table-text"}>0.009739 ETH</td>
          <td>
            <span className={"market__table-change up"}>6.30%</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default MarketView
