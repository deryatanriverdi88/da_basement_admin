import React, {useEffect, useState} from 'react'

export default function CardItem( props ) {
  const { name, img_url, normal_low_price, normal_mid_price, normal_high_price, normal_market_price, foil_low_price, foil_mid_price, foil_high_price, foil_market_price, group_name, rarity, amount, product_id, binder} = props.card

  const [cardItem, setCardItem] = useState("")
  useEffect(() => {
    if(binder){
      fetch(`https://da-basement-games-api.herokuapp.com/find_by_product_id?productId=${product_id}&binderId=${binder.id}`)
      .then(res => res.json())
      .then(card => {
        setCardItem(card)
      })
    }else {
      fetch(`https://da-basement-games-api.herokuapp.com/find_by_product_id?productId=${product_id}`)
      .then(res => res.json())
      .then(card => {
        setCardItem(card)
      })
    }
  }, [props.card])

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
                        <span>Low Price :</span>
                        ${normal_low_price}
                      </li>
                      <li>
                        <span>Mid Price :</span>
                        ${normal_mid_price}
                      </li>
                      <li>
                        <span>High Price :</span>
                        ${normal_high_price}
                      </li>
                      <li>
                        <span>Market Price : </span>
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
      <div className="amount">
       <p>Amount of card(s) just added :{props.amount}</p>
        {
          cardItem.length > 0  && cardItem[0].id ?
            <p> Amount of {cardItem[0].name} in {cardItem[0].binder.name} : {cardItem[0].amount}</p>
            :
            <p>{cardItem.length > 0 ? "It doesn't exist in the binder" : null }</p>
        }
      </div>
    </>
  )
}
