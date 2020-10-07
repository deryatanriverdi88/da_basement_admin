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

    componentDidMount(){
        fetch('http://localhost:3000/last_ten')
        .then(res=>res.json())
        .then(cardData => {
            this.props.getCards(cardData)
        })
    }

    render() {
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
