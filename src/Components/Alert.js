import React from 'react'

export default function Alert(props) {
    return (
        <div className="background-for-z-index">
            <div className="alert-div">
                <p> You are deleting this binder permanently, are you sure?</p>
                <div className="alert-buttons">
                    <button onClick={props.deleteBinder} >Yes, delete it!</button>
                    <button onClick={props.handleBinderDelete}>Oops, no!</button>
                </div>
            </div>
        </div>
    )
}
