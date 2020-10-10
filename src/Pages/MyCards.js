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

    handleClick = (e, card) => {
        console.log(card)
        this.setState({
            amount: card.amount,
            editForm: !this.state.editForm,
            editCard: card
        })
    }

    handleChange = (e) => {
        this.setState({
            amount: e.target.value
        })
    }

    handleSearchChange = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    }

    handleEditSubmit = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3000/favorite_cards/${this.state.editCard.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json'
          },
          body: JSON.stringify({
           amount: this.state.amount
          })
        })
        .then(res => res.json())
        .then(card => {
          const newCards =  this.state.myCards.map(cardItem => {
              return cardItem.id === card.id ? card : cardItem
          })
          this.setState({
            editCard:  null,
            myCards:  newCards,
            editForm: false,
            amount: null
          })
        })
    }

    render() {
        console.log(this.state.myCards)
        const searchedCards =
            this.state.myCards.filter(card => {
                if (card.magic_the_gatherig_card.name.replace(/[^a-zA-Z0-9]/g, "").substr(0, this.state.searchValue.length).toLowerCase() === this.state.searchValue.toLowerCase()) {
                    return card
                }
            })

        return (
            <div>
                My Cards
            </div>
        )
    }
}