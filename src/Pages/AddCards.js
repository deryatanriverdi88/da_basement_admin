import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardForm from '../Components/CardForm'
import PopUp from '../Components/PopUp'

class AddCards extends Component {
    state = {
        searchValue: "",
        card: {},
        cardForm: false,
        popUp: false,
        cardNames: [],
        cardName: "",
        binder: {}
    }

    handleChange = (event) => {
        this.setState({
            searchValue: event.target.value
        })
    }

    handleClick = (cardName) => {
        fetch(`http://localhost:4000/card?name=${cardName}`)
        .then(res => res.json())
        .then(cardItem => {
            this.props.getCards(cardItem)
        })
        this.setState({
            cardForm: !this.state.cardForm,
            cardName: cardName
        })
    }

    handleClose = () => {
        this.props.clearCards()
        this.setState({
            cardForm: !this.state.cardForm
        })
    }

    handleCardFormTurnOff = (card)=> {
        this.setState({
            cardForm: false,
            popUp: true,
            card: card
        })
    }

    componentDidUpdate = () =>{
        setTimeout(() => this.setState({popUp: false}), 8000)
    }

    componentDidMount(){
        fetch('http://localhost:3000/last_ten')
        // fetch('http://localhost:3000/magic_the_gatherig_cards')
        .then(res=>res.json())
        .then(cardData => {
            this.props.getCards(cardData)
        })
    }

    renderPopUp = (cond) => {
        if(cond === true){
           return  <PopUp card={this.state.card} />
        } else if(cond === false) {
           return null
        }
    }

    render() {
        const searchedCards = 
        this.props.cards.filter(card => {
            if (card.name.replace(/[^a-zA-Z0-9]/g, "").substr(0, this.state.searchValue.length).toLowerCase() === this.state.searchValue.toLowerCase()) {
                return card
            }
        })
        return (
            <div className="add-card-div">
                <form className="add-card-form" htmlFor="search">
                    <label>Search</label>
                    <input className="add-card-input"
                           type="text"
                           name="search"
                           autoComplete="off"
                           autoCorrect="off"
                           onChange={this.handleChange}
                    />
                </form>
                {this.renderPopUp(this.state.popUp)}
                <div className="table">
                    <table>
                        <thead className="t-head">
                            <tr className="row">
                                <th className="name">Card Name</th>
                                <th className="rarity">Rarity</th>
                                <th className="foil">Foil</th>
                                <th  className="set-name">Set Name</th>
                                <th  className="low-price">Low Price</th>
                                <th  className="mid-price">Mid Price</th>
                                <th className="high-price">High Price</th>
                                <th  className="market-price">Market Price</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.searchValue.length > 0?
                            searchedCards.map(card => {
                                return <tr key={card.id}
                                           className="row"
                                           onClick={() => this.handleClick(card)}>
                                            <td>
                                                <ReactHover options={optionsCursorTrueWithMarginForImage}>
                                                    <Trigger type="trigger">
                                                        <p className="hover-me">{card.name}</p>
                                                    </Trigger>
                                                    <Hover type="hover">
                                                        <img src={card.img_url} alt={card.name}/>
                                                    </Hover>
                                                </ReactHover>
                                            </td>
                                            <td>{card.rarity}</td>
                                            {
                                              card.foil_low_price || card.foil_mid_price || card.foil_high_price || card.foil_market_price ?
                                                <td>
                                                    <ReactHover options={optionsCursorTrueWithMarginForFoil}>
                                                        <Trigger type="trigger">
                                                            <p className="hover-me">Yes, hover me!</p>
                                                        </Trigger>
                                                        <Hover type="hover">
                                                            <table className="foil-hover">
                                                                <tbody>
                                                                    <tr>
                                                                        <td colSpan="2">{card.name}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Foiled Low Price : </td>
                                                                        <td>${card.foil_low_price}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Foiled Mid Price :</td>
                                                                        <td>${card.foil_mid_price}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Foiled High Price : </td>
                                                                        <td>${card.foil_highprice}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Foiled Market Price : </td>
                                                                        <td>${card.foil_market_price}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </Hover>
                                                    </ReactHover>
                                                </td>
                                            :
                                                <td>No</td>
                                            }
                                        <td>{card.group_name}</td>
                                        {card.normal_low_price ? <td>${card.normal_low_price}</td> : <td>$</td>}
                                        {card.normal_mid_price ? <td>${card.normal_mid_price}</td> : <td>$</td>}
                                        {card.normal_high_price ? <td>${card.normal_high_price}</td> : <td>$</td>}
                                        {card.normal_market_price ? <td>${card.normal_market_price}</td> : <td>$</td>}
                                    </tr>
                            })
                            :
                            <>
                                <tr>
                                    <td colSpan="8" className="cards-are-loading">There are {this.props.cards.length} cards in the database.</td>
                                </tr>
                            </>
                        }
                        </tbody>
                    </table>
                </div>

                {this.state.cardForm ?
                    <>
                       <CardForm card={this.state.card} handleClick={this.handleClick} handleCardFormTurnOff={this.handleCardFormTurnOff}
                       />
                    </>
                     :
                    null
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCards: (cardObject) => {
            dispatch({
                type: 'GET_CARDS', payload: cardObject
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        cards: state.addCards
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCards)