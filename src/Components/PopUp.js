import React from 'react'

export default function PopUp(props) {
    return (
        <div className="background-for-pop-up-index">
             {console.log(props.card.foil)}
            <div className="pop-up">
                {console.log(props.card)}
                <div className ="pop-up-fade">
                <p>{props.amount} of {props.card.name} is added !</p>
                <p> Foil : {props.foil ? "Foil" : "Non foil"}</p>
                {/* {props.errors ? <p>{props.errors} </p> : <p>{props.card.name} is added !</p>} */}
                <img src={props.card.img_url} alt={props.card.name}/>
                </div>
             </div>
        </div>
    )
}
