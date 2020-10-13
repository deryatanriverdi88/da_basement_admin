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
        fetch('https://da-basement-games-api.herokuapp.com/favorite_cards', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept':'application/json'
            },
            body: JSON.stringify({
                user_id: this.props.current_user.id,
                amount: this.state.amount,
                foil: this.state.foil,
                normal: this.state.normal,
                name: this.props.card.name,
                img_url: this.props.card.img_url,
                category_id: this.props.card.category_id,
                product_id: this.props.card.product_id,
                group_id: this.props.card.group_id,
                rarity: this.props.card.rarity,
                sub_type: this.props.card.sub_type,
                text: this.props.card.text,
                group_name: this.props.card.group_name,
                normal_low_price: this.props.card.normal_low_price,
                normal_mid_price: this.props.card.normal_mid_price,
                normal_high_price: this.props.card.normal_high_price,
                normal_market_price: this.props.card.normal_market_price,
                foil_low_price: this.props.card.foil_low_price,
                foil_mid_price: this.props.card.foil_mid_price,
                foil_high_price: this.props.card.foil_high_price,
                foil_market_price: this.props.card.foil_market_price
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
        const { name, foil_low_price, foil_mid_price, foil_high_price, foil_market_price , normal_low_price, normal_mid_price, normal_high_price, normal_market_price } = this.props.card
        return (
            <div className="background-for-z-index">
                 <div className="card-form">
                    {this.state.errors ? <p>{this.state.errors[0]}</p> : null}
                 <h3 className="card-name">{ name }</h3>
                 <form onSubmit={this.handleSubmit} id="add-card-form">
                     <div className="form-fields">
                        <label htmlFor="amount"> <span className="amount"> Amount </span></label>
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    onChange={this.handleChange}
                                    value={this.state.amount}
                                />
                                { foil_low_price || foil_mid_price || foil_high_price || foil_market_price ?
                                <>
                                <label htmlFor="foil"><span className="foil"> Foiled </span></label>
                                        <input
                                            id="foil"
                                            name="foil"
                                            disabled={this.state.foilDisable}
                                            type="checkbox"
                                            onChange={this.handleCardVersionChange}
                                            value={this.state.foil}
                                        />
                                </>
                                :
                                null
                                }
                                { normal_low_price || normal_mid_price || normal_high_price || normal_market_price ?
                                <>
                                <label htmlFor="normal"><span className="normal"> Normal </span></label>
                                        <input
                                            id="normal"
                                            name="normal"
                                            type="checkbox"
                                            disabled={this.state.normalDisable}
                                            onChange={this.handleCardVersionChange}
                                            value={this.state.normal}
                                        />
                                </>
                                :
                                null
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
                            </div>

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