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
        this.props.cards.sort((a, b) => a - b).filter(card => {
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
                           onChange={this.handleChange}
                    />
                </form>
                <ul className="cards">
                    {this.props.cards ?
                        searchedCards.map(card => {
                            return <li key={card.id}
                                       onClick={() => this.handleClick(card)}>
                                       {card.name}
                                   </li>
                        }) : "Cards are loading..."
                    }
                </ul>
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