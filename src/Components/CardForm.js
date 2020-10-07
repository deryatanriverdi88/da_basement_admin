import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardItem from "./CardItem"
import { withRouter } from 'react-router-dom'

export default class CardForm extends Component {
    state={
        amount: null,
        cardView: false,
        card: {}
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick = (cardItem) => {
        this.setState({
            cardView: !this.state.cardView,
            card: cardItem
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        fetch('http://localhost:3000/favorite_cards', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept':'application/json'
            },
            body: JSON.stringify({
                user_id: this.props.current_user.id,
                magic_the_gatherig_card_id: this.props.card.id,
                amount: this.state.amount
            })
        })
        .then(res => res.json())
        .then(card => {
            this.setState({
                card: card
            })
            setTimeout(() => {
                this.props.history.push(`/myCards`)
            }, 50)
        })
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}
