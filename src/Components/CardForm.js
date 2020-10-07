import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardItem from "./CardItem"
import { withRouter } from 'react-router-dom'

class CardForm extends Component {
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
        const {name} = this.props.card
        return (
            <div className="background-for-z-index">
                 <div className="card-form">
                 <h3 className="card-name">{ name }</h3>
                 <form onSubmit={this.handleSubmit}>
                         <label htmlFor="amount"> <span className="amount"> How many : </span></label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                onChange={this.handleChange}
                                value={this.state.amount}
                            />
                            <input
                                type="hidden"
                                id="user"
                                name="userId"
                            />
                            <input
                                type="hidden"
                                id="card"
                                name="magic_the_gatherig_card_id"
                            />
                           <input className="add-your-card" type="submit" value="Add to your favorite cards!" />
                     </form>
                    <button className="x" onClick={this.props.handleClick}> <span > ❌ </span></button>
                    <button className="card-info-button" onClick={() => this.handleClick(this.props.card)}> See card info </button>
                    {
                        this.state.cardView ?
                        <CardItem card={this.state.card} handleClick={this.handleClick} /> :
                        null
                    }
                 </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        current_user: state.user
    }
}

export default withRouter(connect(mapStateToProps, null)(CardForm))