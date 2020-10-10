import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardForm from '../Components/CardForm'
import ReactHover, {Trigger, Hover} from 'react-hover'
const optionsCursorTrueWithMarginForImage = {followCursor:true, shiftX: -280, shiftY: -280}
const optionsCursorTrueWithMarginForFoil = {followCursor:true, shiftX: -320, shiftY: -320}

class AddCards extends Component {
    state = {
        searchValue: "",
        card: {},
        cardForm: false
    }

    handleChange = (event) => {
        this.setState({
            searchValue: event.target.value
        })
    }

    handleClick = (cardItem) => {
        this.setState({
            card: cardItem,
            cardForm: !this.state.cardForm
        })
    }

    componentDidMount(){
        fetch('http://localhost:3000/last_ten')
        .then(res=>res.json())
        .then(cardData => {
            this.props.getCards(cardData)
        })
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
                    </table>
                </div>
                {this.state.cardForm ?
                    <>
                     <CardForm card={this.state.card} handleClick={this.handleClick} />
                    </> :
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