import React from 'react'
import {Link, NavLink, withRouter} from 'react-router-dom'
import { connect, useSelector } from 'react-redux'

function NavBar(props) {
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
                        <Link className="link" to="/">My Cards</Link>
                        <Link className="link" to="/addCards">
                            Add Cards
                        </Link>
                        <NavLink className="link" to="/">
                            <button id="logout" onClick={logOut}>Logout</button>
                        </NavLink>
                    </div>
                </nav>
             </>
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