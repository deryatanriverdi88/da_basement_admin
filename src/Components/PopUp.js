import React from 'react'

export default function PopUp(props) {
    return (
        <div className="pop-up">
            {console.log(props.card)}
            <div className ="pop-up-fade">
               <p>{props.card.name} is added <span role="img" aria-label="emoji"> ✅ </span></p>
            </div>
        </div>
    )
}
