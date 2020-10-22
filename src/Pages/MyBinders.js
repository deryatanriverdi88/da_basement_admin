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

    handleBinderClick = (e) => {
        let binderItem= this.props.binders.filter(i => {
            return i.id === parseInt(e.target.value)
        })[0]
        this.setState({
            binderItem: binderItem
        })
        this.props.setFavoriteCards(binderItem.favorite_cards)
    }

    handleAddCardClick = () => {
        this.props.history.push({pathname: `/addCards/${this.state.binderItem.name}`, state: {binder: this.state.binderItem}})
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyBinders))
