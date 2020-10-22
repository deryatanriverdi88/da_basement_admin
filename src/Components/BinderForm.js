import React, { useState } from 'react'
import {withRouter} from 'react-router-dom'

function BinderForm({current_user, history, setBinderForm}) {
    const [binderName, setBinderName ] = useState("")
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
            history.push({pathname: `/addCards/${binderObj.name}`,
            state: {binder: binderObj},
            })
            setBinderForm(false)
        })
    }
    return (
        <div>
        </div>
    )
}

export default withRouter(BinderForm)
