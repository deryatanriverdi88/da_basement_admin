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
        fetch('https://da-basement-games-api.herokuapp.com/favorite_cards')
        // fetch('http://localhost:5000/favorite_cards')
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

    handleCount = (v1, v2) => {
        let count = 0
        if(this.state.myCards.length > 0){
            this.state.myCards.map(card =>{
                if(v1 === "amount"){
                    count += card[v1]
                }else{
                    if(card.foil){
                        delete card[v1]
                        if(card[v2] === null){
                            delete card[v2]
                        }else {
                            count += Number.parseFloat(card[v2] * card.amount)
                        }
                    } else if(card.normal){
                        delete card[v2]
                        if(card[v1] === null){
                            delete card[v1]
                        }else {
                            count += Number.parseFloat(card[v1] * card.amount)
                        }
                    }
                }
            })
        }
        return count
    }

    handleEditSubmit = (e) => {
        e.preventDefault()
        fetch(`https://da-basement-games-api.herokuapp.com/favorite_cards/${this.state.editCard.id}`, {
        // fetch(`http://localhost:5000/favorite_cards/${this.state.editCard.id}`, {
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
        fetch(`https://da-basement-games-api.herokuapp.com/favorite_cards/${card.id}`, {
        // fetch(`http://localhost:5000/favorite_cards/${card.id}`, {
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
        const searchedCards = this.state.myCards.filter(card => {
            if(card.name) {
                if (card.name.replace(/[^a-zA-Z0-9]/g, "").substr(0, this.state.searchValue.length).toLowerCase() === this.state.searchValue.toLowerCase()) {
                    return card
                }
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
                                                      handleDelete={this.handleDelete}
                                          />
                                })
                                 :
                                null
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total Cards</td>
                                <td>{this.handleCount('amount')}</td>
                                <td colSpan="3">Value</td>
                                <td>${this.handleCount("normal_low_price", "foil_low_price").toFixed(2)}</td>
                                <td>${this.handleCount("normal_mid_price", "foil_mid_price").toFixed(2)}</td>
                                <td>${this.handleCount("normal_high_price", "foil_high_price").toFixed(2)}</td>
                                <td>${this.handleCount("normal_market_price", "foil_market_price").toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        )
    }
}