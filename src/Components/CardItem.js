import React from 'react'

export default function CardItem( props ) {
  const { name, img_url, normal_low_price, normal_mid_price, normal_high_price, normal_market_price, foil_low_price, foil_mid_price, foil_high_price, foil_market_price, group_name, rarity } = props.card
  return (
    <>
      <div className="card-item">
          <img src={img_url} alt={name}/>
          <div className="price-list">
                <h4><b>Set Name : </b>{group_name}</h4>
                <h4><b>Rarity : </b>{rarity}</h4>
                {
                  !props.normal && !props.foil ?
                  <>
              <ul>
                  <li>Normal Low Price : ${normal_low_price}</li>
                  <li>Normal Mid Price : ${normal_mid_price}</li>
                  <li>Normal High Price : ${normal_high_price}</li>
                  <li>Normal Market Price : ${normal_market_price}</li>
              </ul>
              <ul>
                  <li>Foil Low Price : ${foil_low_price}</li>
                  <li>Foil Mid Price : ${foil_mid_price}</li>
                  <li>Foil High Price : ${foil_high_price}</li>
                  <li>Foil Market Price : ${foil_market_price}</li>
              </ul> </>
              : null
              }
              {
                props.normal ?
                <ul>
                  <li>Normal Low Price : ${normal_low_price}</li>
                  <li>Normal Mid Price  : ${normal_mid_price}</li>
                  <li>Normal High Price : ${normal_high_price}</li>
                  <li>Normal Market Price : ${normal_market_price}</li>
              </ul> : null
              }
              {
                props.foil ?
                <ul>
                  <li>Foil Low Price : ${foil_low_price}</li>
                  <li>Foil Mid Price : ${foil_mid_price}</li>
                  <li>Foil High Price : ${foil_high_price}</li>
                  <li>Foil Market Price : ${foil_market_price}</li>
              </ul> : null
              }

          </div>
      </div>
    </>
  )
}
