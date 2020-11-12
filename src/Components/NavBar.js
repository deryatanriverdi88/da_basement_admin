import React, { useState } from 'react'
import {Link, NavLink, withRouter} from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
import BinderForm from './BinderForm'

function NavBar(props) {
    const [binderForm, setBinderForm] = useState(false)

    const current_user = useSelector(state => {
        return state.user
    })

    const clearToken = () => {
        localStorage.clear()
    }
    const logOut = () => {
        props.clearUser()
        clearToken()
        props.history.push('/')
    }

    const handleBinderForm = () => {
        setBinderForm(!binderForm)
    }

    return (
       
        <>
        {!current_user.id ?
             <div id="header">
                <h1 className="header-name"> Admin Page</h1>
             </div> : 
             <>
                <div id="header">
                    <h1 className="header-name"> Admin Page</h1>
                </div>
                <nav id="nav-bar">
                    <div className="link-div">
                        <Link className="link" to="/my-cards">My Cards</Link>
                        <Link className="link" to={{pathname:"/add-cards",state: {binder : {}}}}>
                            Add Cards
                        </Link>
                        <Link className="link" to="/my-binders">
                            My Binders
                        </Link>
                        <button id="add-binder" onClick={handleBinderForm}>Add Binder</button>
                        <button id="logout" onClick={logOut}>
                            <NavLink to="/">
                                Logout
                            </NavLink>
                        </button>
                    </div>
                </nav>
             </>
        }
        {
            binderForm ? <BinderForm  current_user={current_user} setBinderForm={setBinderForm}/> : null

        }
       
        </>
    )
}

const mapDispatchToProps = (dispatch)=>{
    return {
        clearUser: () => {
            dispatch({
                type: 'CLEAR_USER'
            })
        }
    }
}

export default withRouter(connect(null, mapDispatchToProps)(NavBar))