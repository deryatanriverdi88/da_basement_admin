import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardItem from "./CardItem"
import { withRouter } from 'react-router-dom'

class CardForm extends Component {
    state={
        amount: 0,
        cardView: false,
        card: {},
        foilDisable: false,
        normalDisable: false,
        foil: false,
        normal: false,
        errors: {},
        cardAdded: false
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidUpdate = () => {
        if(this.state.cardAdded){
            this.props.handleCardFormTurnOff(this.state.card)
        }
    }

    handleCardVersionChange = (e) => {
        if(e.target.name === 'normal'){
            this.setState({
                normal: true,
                foil: false,
                normalDisable: false,
                foilDisable: !this.state.foilDisable
            })
        } else if(e.target.name === 'foil') {
            this.setState({
                foil: true,
                normal: false,
                foilDisable: false,
                normalDisable: !this.state.normalDisable
            })
        }
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
                amount: this.state.amount,
                foil: this.state.foil,
                normal: this.state.normal
            })
        })
        .then(res => res.json())
        .then(card => {
            if(card.errors){
                this.setState({
                    errors: card.errors
                })
            } else {
                this.setState({
                    card: card,
                    cardAdded: true
                })
            }
        })
    }

    render() {
        const {name, foil_low_price, foil_mid_price, foil_high_price, foil_market_price } = this.props.card
        return (
            <div className="background-for-z-index">
                 <div className="card-form">
                    {this.state.errors ? <p>{this.state.errors[0]}</p> : null}
                 <h3 className="card-name">{ name }</h3>
                 <form onSubmit={this.handleSubmit}>
                         <label htmlFor="amount"> <span className="amount"> Amount </span></label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                onChange={this.handleChange}
                                value={this.state.amount}
                            />
                       { foil_low_price || foil_mid_price || foil_high_price || foil_market_price ?
                       <><label htmlFor="foil"><span className="foil"> Foiled </span></label>
                            <input
                                id="foil"
                                nam="foil"
                                type="checkbox"
                                onChange={this.handleFoilChange}
                                value={this.state.foil}
                            /> </> : null
                            }
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