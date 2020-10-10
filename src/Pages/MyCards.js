import React, { Component } from 'react'
import MyCardItem from '../Components/MyCardItem'

export default class MyCards extends Component {
    state={
        myCards: [],
        amount: null,
        editForm: false,
        editCard: null,
        searchValue: ""
    }

    componentDidMount =  () => {
        fetch('http://localhost:3000/favorite_cards')
        .then(res => res.json())
        .then(cardItems => {
              this.setState({
                myCards: cardItems
            })
        })
    }

    handleClick = (e, card) => {
        console.log(card)
        this.setState({
            amount: card.amount,
            editForm: !this.state.editForm,
            editCard: card
        })
    }

    render() {
        return (
            <div>
                My Cards
            </div>
        )
    }
}