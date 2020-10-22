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

    handleDelete = () => {
        fetch(`https://da-basement-games-api.herokuapp.com/binders/${this.state.binderItem.id}`, {
                  method: 'DELETE'
             }).then(res => {
          const newBinders = this.props.binders.filter(binder =>{
            return binder.id !== this.state.binderItem.id
           })
           this.props.setBinders(newBinders)
        })
    }

    handleCount = (v1, v2) => {
        let count = 0
        if(this.state.binderItem.id){
            this.props.favoriteCards.map(card =>{
                if(v1 === "amount"){
                    count += card[v1]
                }else{
                    if(card.foil){
                        delete card[v1]
                        if(card[v2] === null){
                            delete card[v2]
                        }else {
                            count += Number.parseFloat(card[v2] * card.amount)
                        }
                    } else if(card.normal){
                        delete card[v2]
                        if(card[v1] === null){
                            delete card[v1]
                        }else {
                            count += Number.parseFloat(card[v1] * card.amount)
                        }
                    }
                }
            })
        }
        return count
    }

    handleClick = (e, card) => {
        console.log(card)
        this.setState({
            amount: card.amount,
            editForm: !this.state.editForm,
            editCard: card
        })
    }

    handleChange = (e) => {
        this.setState({
            amount: e.target.value
        })
    }

    handleEditSubmit = (e) => {
        e.preventDefault()
        fetch(`https://da-basement-games-api.herokuapp.com/favorite_cards/${this.state.editCard.id}`, {
        // // fetch(`http://localhost:5000/favorite_cards/${this.state.editCard.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json'
          },
            body: JSON.stringify({
            amount: this.state.amount
          })
        })
        .then(res => res.json())
        .then(card => {
            const newCards = this.props.favoriteCards.map(cardItem => {
                return cardItem.id === card.id ? card : cardItem
            })
            this.setState({
                editCard:  null,
                editForm: false,
                amount: null
            })
            this.props.setFavoriteCards(newCards)
        })
    }
    render() {
        return (
            <>
            </>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyBinders))
