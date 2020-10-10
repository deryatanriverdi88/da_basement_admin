import React, { Component } from 'react'
import MyCardItem from '../Components/MyCardItem'

export default class MyCards extends Component {
    state={
        myCards: [],
        amount: null,
        editForm: false,
        editCard: null,
        searchValue: ""
    }

    componentDidMount =  () => {
        fetch('http://localhost:3000/favorite_cards')
        .then(res => res.json())
        .then(cardItems => {
              this.setState({
                myCards: cardItems
            })
        })
    }

    render() {
        return (
            <div>
                My Cards
            </div>
        )
    }
}