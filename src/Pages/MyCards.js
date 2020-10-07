import React, { Component } from 'react'

export default class MyCards extends Component {
    state={
        myCards: []
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
