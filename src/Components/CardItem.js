import React from 'react'

export default function CardItem(props) {
  const {name, img_url} = props.card
  return (
    <div className="card-item">
      <ul>
        <li> <span>Name :</span> { name } </li>
        <li> <img src={img_url} alt={name}/></li>
        <button  className="x" onClick={props.handleClick}> <span> ❌ </span></button>
      </ul>
    </div>
  )
}
