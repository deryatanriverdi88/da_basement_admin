import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyBinderItem from '../Components/MyBinderItem'
import {withRouter} from 'react-router-dom'

class MyBinders extends Component {

    state={
        binderItem: {},
        binderName: "",
        amount: null,
        editForm: false,
        editCard: null
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyBinders))
