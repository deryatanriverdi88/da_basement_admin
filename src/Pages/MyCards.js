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

    handleDelete = (card) => {
        fetch(`http://localhost:3000/favorite_cards/${card.id}`, {
                  method: 'DELETE'
             }).then(res => {
          const newCards = this.state.myCards.filter(myCard =>{
            return myCard.id !== card.id
           })
           this.setState({
            myCards: newCards
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
                <form className="add-card-form" htmlFor="search">
                    <label>Search</label>
                    <input className="add-card-input"
                           type="text"
                           name="search"
                           autoComplete="off"
                           autoCorrect="off"
                           onChange={this.handleSearchChange}
                    />
                </form>
                <div className="table">
                    <table>
                        <thead>
                            <tr className="row">
                                <th className="amount">Amount</th>
                                <th className="name">Card Name</th>
                                <th className="rarity">Rarity</th>
                                <th className="foiled">Foiled</th>
                                <th className="set-name">Set Name</th>
                                <th className="low-price">Low Price</th>
                                <th className="mid-price">Mid Price</th>
                                <th className="high-price">High Price</th>
                                <th className="market-price">Market Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                              this.state.myCards.length > 0 ?
                                searchedCards.map((card)=>{
                                   return <MyCardItem card={card}
                                                      key={card.id}
                                                      handleClick={this.handleClick}
                                                      editForm={this.state.editForm}
                                                      amount={this.state.amount}
                                                      handleChange={this.handleChange}
                                                      editCard={this.state.editCard}
                                                      handleEditSubmit={this.handleEditSubmit}
                                          />
                                })
                                 :
                                null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}