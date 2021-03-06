import React, { useState } from 'react'
import {withRouter} from 'react-router-dom'

function BinderForm({current_user, history, setBinderForm}) {
    const [binderName, setBinderName ] = useState("")
    const [errors, setErrors] = useState("")
    const handleOnChange =(e) => {
        setBinderName(e.target.value)
    }

    const handleOnSubmit = (e) =>{
        e.preventDefault()
        fetch('https://da-basement-games-api.herokuapp.com/binders', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body:JSON.stringify({
                user_id: current_user.id,
                name: binderName
            })
        })
        .then(res => res.json())
        .then(binderObj => {
            if(binderObj.errors ){
                setErrors(binderObj.errors[0])
            } else {
                history.push({pathname: `/add-cards/${binderObj.name}`,
                state: {binder: binderObj},
                })
                setBinderForm(false)
            }
        })
    }
    return (
        <div>
            <div className="background-for-z-index">
                <div className="binder-div">
                    <div className="x-div">
                        <button className="x" onClick={() => setBinderForm(false)}> X </button>
                    </div>
                    <div className="form-div">
                        <form onSubmit={handleOnSubmit}>
                        {
                            errors.length > 0 ? <p>{errors}</p> : null
                        }
                            <label htmlFor="binderName"> Name </label>
                            <input
                                name="binderName"
                                value={binderName}
                                onChange={handleOnChange}
                            />
                            <input type="submit"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(BinderForm)
