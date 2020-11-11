import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardItem from "./CardItem"
import { withRouter } from 'react-router-dom'
import Select from 'react-select';
import PopUp from "./PopUp"

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
        dropDown: false,
        popUp: false
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleDropdown  = (card)=>{
        const { normal_low_price, normal_mid_price, normal_high_price, normal_market_price } = card.value
        this.setState({
            card: card.value
        })
        if(!normal_low_price && !normal_mid_price && !normal_high_price && !normal_market_price){
            this.setState({
                foil: true
            })
        }
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
                amount: Number.parseInt(this.state.amount),
                binder_id: this.props.binder.id,
                foil: this.state.foil,
                name: this.state.card.name,
                img_url: this.state.card.img_url,
                icon: this.state.card.icon,
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
                    popUp: true
                })
            }
            this.props.updateBinder(card)
        })
    }

    componentDidUpdate = () => {
        if(this.state.popUp){
            setTimeout(() => this.setState({popUp: false, amount: 1}), 500)
        }
    }


    renderPopUp = () => {
        if(this.state.popUp){
           return  <PopUp card={this.state.card} amount={this.state.amount}/>
        } else {
           return null
        }
    }

    render() {
        let cards = []
        if(this.props.cards.length > 0){
            cards =
                this.props.cards.map(card => {
                return {
                            value: card,
                            label: <div className="select" style={{display: "flex", justifyContent: "left"}}>
                                        <p> {card.name} </p>
                                        {
                                            card.icon ?
                                                <div className="icon-div" style={{width: "30px", height: "30px", margin: "auto"}}>
                                                    <img src={card.icon} className="icon"style={{width: "100%", height: "100%"}}/>
                                                </div>
                                                :
                                                <div className="icon-div" style={{width: "auto", height: "30px", margin: "auto"}}>
                                                    <p> {card.group_name} </p>
                                                </div>
                                        }
                                    </div>
                        }
                })
        }
        const {foil_low_price, foil_mid_price, foil_high_price, foil_market_price } = this.state.card

        return (
            <div className="background-for-z-index" onKeyDown={this.props.handleEscape}>
                <div className="card-form">
                    <div className="x-div">
                        <button className="x" onClick={this.props.handleClose}> X </button>
                    </div>
                    {
                        this.state.errors ?
                            <p> {this.state.errors[0]} </p>
                            :
                            null
                    }
                    {
                        !this.state.card.name ?
                            null
                            :
                            <div className="form-header">
                            {
                                this.state.card.icon !== "" ?
                                    <>
                                        <h3> {this.state.card.name} </h3>
                                        <div className="icon-div">
                                            <img src={this.state.card.icon} alt="icon" className="icon"/>
                                        </div>
                                    </>
                                    :
                                    <h3> {this.state.card.name} - {this.state.card.group_name} </h3>
                            }
                            </div>
                        }
                    <Select
                        autoFocus
                        placeholder="Select a card..."
                        value={this.state.card.value}
                        onChange={this.handleDropdown}
                        options={cards}
                    />
                    <form onSubmit={this.handleSubmit} className="add-card-form">
                        <div className="form-fields">
                            <div className="amount-div">
                                <div>
                                    <label htmlFor="amount">
                                        <span className="amount"> Amount </span>
                                    </label>
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        onChange={this.handleChange}
                                        value={this.state.amount}
                                    />
                                </div>
                            </div>
                                <div className="foil-or-not">
                                    {
                                        foil_low_price || foil_mid_price || foil_high_price || foil_market_price ?
                                            <div className="foil-div">
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
                                </div>
                                <input
                                    type="hidden"
                                    id="user"
                                    name="userId"
                                />
                        </div>
                            {
                                this.state.card.id ?
                                <input className="add-your-card" type="submit" value="Add!" />
                                :
                                <p>Select a card from above</p>
                            }
                                   {
                                    this.renderPopUp()
                                   }
                    </form>
                        <CardItem
                            card={this.state.card}
                            foil={this.state.foil}
                        />
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