import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardItem from "./CardItem"
import { withRouter } from 'react-router-dom'

class CardForm extends Component {
    state={
        amount: 1,
        cardView: false,
        card: {},
        foilDisable: false,
        normalDisable: false,
        foil: false,
        errors: {},
        cardAdded: false,
        dropDown: false
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleDropdown  = ()=>{
        this.setState({
            dropDown: !this.state.dropDown
        })
    }

    handleCardClick = (card) => {
        this.setState({
            card: card,
            dropdown: !this.state.dropdown
        })
    }

    handleCardDropdownClose = () => {
        this.setState({
            dropDown: !this.state.dropDown
        })
    }

    componentDidUpdate = () => {
        if(this.state.cardAdded){
            this.props.handleCardFormTurnOff(this.state.card)
            this.props.handleClose()
        }
    }

    handleCardVersionChange = () => {
        this.setState({
            foil: !this.state.foil
        })
    }

    handleCardItemDetailsClick = (cardItem) => {
        this.setState({
            cardView: !this.state.cardView,
            card: cardItem
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        fetch('https://da-basement-games-api.herokuapp.com/favorite_cards', {
            // fetch('http://localhost:5000/favorite_cards', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept':'application/json'
            },
            body: JSON.stringify({
                user_id: this.props.current_user.id,
                amount: this.state.amount,
                binder_id: this.props.binder.id,
                foil: this.state.foil,
                normal: this.state.normal,
                name: this.state.card.name,
                img_url: this.state.card.img_url,
                category_id: this.state.card.category_id,
                product_id: this.state.card.product_id,
                group_id: this.state.card.group_id,
                rarity: this.state.card.rarity,
                sub_type: this.state.card.sub_type,
                text: this.state.card.text,
                group_name: this.state.card.group_name,
                normal_low_price: this.state.card.normal_low_price,
                normal_mid_price: this.state.card.normal_mid_price,
                normal_high_price: this.state.card.normal_high_price,
                normal_market_price: this.state.card.normal_market_price,
                foil_low_price: this.state.card.foil_low_price,
                foil_mid_price: this.state.card.foil_mid_price,
                foil_high_price: this.state.card.foil_high_price,
                foil_market_price: this.state.card.foil_market_price
            })
        })
        .then(res => res.json())
        .then(card => {
            if(card.errors ){
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
        const {normal_low_price, normal_mid_price, normal_high_price, normal_market_price, foil_low_price, foil_mid_price, foil_high_price, foil_market_price} = this.state.card

        return (
            <div className="background-for-z-index">
                <div className="card-form">
                    <div className="x-div">
                        <button className="x" onClick={this.props.handleClose}> X </button>
                    </div>
                    {
                        this.state.errors ?
                            <p> {this.state.errors[0]} </p> :
                            null
                    }
                    {
                        !this.state.card.name ?
                            null:
                            <div className="form-header">
                        {
                            this.state.card.icon !== "" ?
                                <h3>{this.state.card.name} <img src={this.state.card.icon} alt="icon" className="icon"/></h3> :
                                <h3>{this.state.card.name} - {this.state.card.group_name}</h3>
                        }
                            </div>
                    }
                    <div className="dropdown" onClick={this.handleCardDropdownClose}>
                        {
                            !this.state.dropDown ?
                                <button onClick={this.handleDropdown} className="dropbtn">
                                    {this.props.cards.length > 0 ?
                                        "Select a card ⬇" :
                                        "Cards are loading..."
                                    }
                                </button> :
                                <button onClick={this.handleDropdown}className="dropbtn">
                                    Select Cards <span>⬆</span>
                                </button>
                        }
                        <div className="dropdown-content">
                            <div className="dropdown-list">
                                <ul>
                                    {
                                        this.state.dropDown && this.props.cards.length  > 0 ?
                                        this.props.cards.map(card =>{
                                        return <li onClick={() => this.handleCardClick(card)} key={card.id}>{card.name}
                                           { card.icon !== "" ? <img className="icon" src={card.icon} alt={card.icon}/> : ` - ${card.group_name}`}
                                            </li>
                                        }) :
                                        null
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
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
                                <div className="foil-or-not">
                                    {
                                        foil_low_price || foil_mid_price || foil_high_price || foil_market_price ?
                                            <div>
                                                <label htmlFor="foil">
                                                    <span className="foil"> Foiled </span>
                                                </label>
                                                <input
                                                    id="foil"
                                                    name="foil"
                                                    disabled={this.state.foilDisable}
                                                    type="checkbox"
                                                    onChange={this.handleCardVersionChange}
                                                    value={this.state.foil}
                                                />
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        normal_low_price || normal_mid_price || normal_high_price || normal_market_price ?
                                            <div>
                                                <label htmlFor="normal">
                                                    <span className="normal"> Normal </span>
                                                </label>
                                                <input
                                                    id="normal"
                                                    name="normal"
                                                    type="checkbox"
                                                    disabled={this.state.normalDisable}
                                                    onChange={this.handleCardVersionChange}
                                                    value={this.state.normal}
                                                />
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                                <input
                                    type="hidden"
                                    id="user"
                                    name="userId"
                                />
                        </div>
                            {
                                this.state.card.id ?
                                <input className="add-your-card" type="submit" value="Add!" />:
                                <p>Select a card from above</p>
                            }
                    </form>
                    {
                        !this.state.cardView ?
                            <button className="card-info-button" onClick={() => this.handleCardItemDetailsClick(this.state.card)}> See card info </button> :
                            null
                    }
                    {
                        this.state.cardView ?
                        <CardItem
                            card={this.state.card}
                            handleCardItemDetailsClick={this.handleCardItemDetailsClick}
                            foil={this.state.foil}
                            normal={this.state.normal}/> :
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