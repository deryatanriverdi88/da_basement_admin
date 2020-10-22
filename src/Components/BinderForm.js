import React, { useState } from 'react'
import {withRouter} from 'react-router-dom'

function BinderForm({current_user, history, setBinderForm}) {
    const handleOnChange =(e) => {
        setBinderName(e.target.value)
    }
    const [binderName, setBinderName ] = useState("")
    return (
        <div>
        </div>
    )
}

export default withRouter(BinderForm)
