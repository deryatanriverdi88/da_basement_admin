import React from 'react'

export default function CardItem( props ) {
  const { name, img_url, normal_low_price, normal_mid_price, normal_high_price, normal_market_price, foil_low_price, foil_mid_price, foil_high_price, foil_market_price, group_name, rarity } = props.card
  return (
    <>
      <div className="card-item">
          <img src={img_url} alt={name}/>
          <div className="price-list">
                <h4>
                  <span>Set Name : </span>
                  {group_name}
                </h4>
                <h4>
                  <span>Rarity : </span>
                  {rarity}
                </h4>
                {
                  props.foil ===  true ?
                  <>
                    <ul>
                      <li>
                        <span>Foil Low Price :</span>
                        ${foil_low_price}
                      </li>
                      <li>
                        <span>Foil Mid Price : </span>
                        ${foil_mid_price}
                      </li>
                      <li>
                        <span>Foil High Price :</span>
                        ${foil_high_price}
                      </li>
                      <li>
                        <span>Foil Market Price : </span>
                        ${foil_market_price}
                      </li>
                    </ul>
                  </>
                  :
                  <>
                    <ul>
                      <li>
                        <span>Normal Low Price :</span>
                        ${normal_low_price}
                      </li>
                      <li>
                        <span>Normal Mid Price :</span>
                        ${normal_mid_price}
                      </li>
                      <li>
                        <span>Normal High Price :</span>
                        ${normal_high_price}
                      </li>
                      <li>
                        <span>Normal Market Price : </span>
                        ${normal_market_price}
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <span>Foil Low Price : </span>
                        ${foil_low_price}
                      </li>
                      <li>
                        <span>Foil Mid Price : </span>
                        ${foil_mid_price}
                      </li>
                      <li>
                        <span>Foil High Price :</span>
                        ${foil_high_price}
                      </li>
                      <li>
                        <span>Foil Market Price : </span>
                        ${foil_market_price}
                      </li>
                    </ul>
                </>
                }
          </div>
      </div>
    </>
  )
}
