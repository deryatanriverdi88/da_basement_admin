import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardForm from '../Components/CardForm'

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
            if (this.state.searchValue !== ""){
                return card.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
            }
        })
        return (
            <div>
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
