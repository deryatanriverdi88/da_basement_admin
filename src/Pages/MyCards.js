import React, { Component } from 'react'
import MyCardItem from '../Components/MyCardItem'
const RARITIES = [ "Common", "Land", "Uncommon","Mythic",  "Promo", "Special", "Rare", "Token"]

class MyCards extends Component {
    state={
        myCards: [],
        amount: null,
        editForm: false,
        editCard: null,
        searchValue: "",
        reversePriceList: "high-to-low",
        rarity: "all-rarities",
        setName: "all-sets",
        setNames: [],
        binderNames: [], 
        binderName: "all-binders",
        cardsWithRarity : [],
        cardsWithSetName: [],
        cardsWithBinderName: []
    }

    componentDidMount =  () => {
        this.fetchCards()
    }

    fetchCards = () => {
        fetch('https://da-basement-games-api.herokuapp.com/favorite_cards')
        // fetch('http://localhost:5000/favorite_cards')
        .then(res => res.json())
        .then(cardItems => {
            const setNames = cardItems.filter(card=>{
                return !this[card.group_name]? this[card.group_name] = true :false
            })
              this.setState({
                myCards: cardItems,
                setNames: setNames.sort((a,b) => a.group_name > b.group_name ? 1 : -1)
            })
        })
        fetch('https://da-basement-games-api.herokuapp.com/binders')
        .then(res => res.json())
        .then(binderObj => {
            this.setState({
                binderNames: binderObj
            })
        })
    }


    handleClick = (e, card) => {
        this.setState({
            amount: card.amount,
            editForm: !this.state.editForm,
            editCard: card
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleDropdownChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if(e.target.name === 'rarity'){
            this.setState({
                 setName: "all-sets",
                 binderName: "all-binders"
            })
        }else if(e.target.name === 'setName'){
            this.setState({
                rarity: "all-rarities",
                binderName: "all-binders"
            })
        }else if(e.target.name === 'binderName'){
            this.setState({
                rarity: "all-rarities",
                setName: "all-sets"
            })
        }
        this.fetchCardsWithAttribute(e.target.name, e.target.value)
    }

    fetchCardsWithAttribute = (att, value) => {
        fetch(`https://da-basement-games-api.herokuapp.com/cards?${att}=${value}`)
        .then(res => res.json())
        .then(cardObj => {
            if(att === "rarity"){
                this.setState({
                    cardsWithRarity: cardObj
                })
            } else if(att === "setName"){
                this.setState({
                    cardsWithSetName: cardObj
                })
            } else if(att === "binderName"){
                this.filterByBinder()
            }
        })
    }

    cardsToRender = () => {
        if(this.state.setName === "all-sets" && this.state.rarity === "all-rarities" && this.state.binderName === "all-binders"){
            return this.state.myCards
        }else if(this.state.rarity !== "all-rarities"){
            return this.state.cardsWithRarity
        }else if(this.state.setName !== "all-sets"){
            return this.state.cardsWithSetName
        }else if(this.state.binderName !== "all-binders"){
            return this.state.cardsWithBinderName
        }
    }

    filterByBinder = () => {
        const newCard = this.state.myCards.filter(card =>{
             if(card.binder.name === this.state.binderName){
                 return card
             }
        })
        this.setState({
            cardsWithBinderName: newCard
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
            this.cardsToRender().map(card =>{
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
                    } else if(!card.foil){
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

    handlePriceClick = (price) => {
        const [normal_low_price, normal_mid_price, normal_high_price, normal_market_price, foil_low_price, foil_mid_price, foil_high_price, foil_market_price] = this.cardsToRender()
        let newList = []
        if(normal_low_price || normal_mid_price || normal_high_price || normal_market_price){
            if(this.state.reversePriceList === "high-to-low"){
                this.setState({
                    reversePriceList: "low-to-high"
                })
                return newList = [...newList, this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  <  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            } else if (this.state.reversePriceList === "low-to-high") {
                this.setState({
                    reversePriceList: "high-to-low"
                })
               return newList = [...newList, this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  >  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            }
        } else if(foil_low_price  || foil_mid_price || foil_high_price || foil_market_price) {
            if(this.state.reversePriceList === "high-to-low"){
                this.setState({
                    reversePriceList: "low-to-high"
                })
                return newList = [...newList, this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  <  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            } else if (this.state.reversePriceList === "low-to-high") {
                this.setState({
                    reversePriceList: "high-to-low"
                })
                return newList = [...newList, this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  >  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            }
        }
        this.setState({
            myCards: newList
        })
    }

    handlePriceLogo = () => {
        if(this.state.reversePriceList === 'low-to-high'){
            return <img src="https://img.icons8.com/ultraviolet/20/000000/up-squared.png" alt="up-arrow"/>
        } else if(this.state.reversePriceList === 'high-to-low'){
            return <img src="https://img.icons8.com/ultraviolet/20/000000/down-squared.png" alt="down-arrow"/>
        }
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
        const newNames = this.cardsToRender().map(card => {
            if(card.name.toLowerCase().startsWith("the ")){
                card.name = card.name.slice(4, card.name.length).concat(', The')
                return card
            } else{
                return card
            }
        })
        const searchedCards = newNames.filter(card => {
            if(card.name) {
                if (card.name.replace(/[^a-zA-Z0-9]/g, "").substr(0, this.state.searchValue.length).toLowerCase() === this.state.searchValue.toLowerCase()) {
                    return card
                }
            }
        })

        return (
            <>
                <form className="search-card" htmlFor="search">
                    <label> Search </label>
                    <input className="add-card-input"
                           type="text"
                           name="search"
                           className="search"
                           autoComplete="off"
                           autoCorrect="off"
                           onChange={this.handleSearchChange}
                    />
                </form>
                <div className="table">
                    <table>
                        <thead>
                            <tr className="row">
                                <th className="amount"> Amount </th>
                                <th className="name"> Card Name </th>
                                <th className="rarity"> Rarity </th>
                                <th className="foiled"> Foiled </th>
                                <th className="binder-name"> Binder Name</th>
                                <th className="set-icon"> Set Icon </th>
                                <th className="set-name">Set Name</th>
                                <th className="low-price price" onClick={()  => this.handlePriceClick("low_price")}>
                                    Low Price
                                    {this.handlePriceLogo()}
                                </th>
                                <th className="mid-price price" onClick={()  => this.handlePriceClick("mid_price")}>
                                    Mid Price
                                    {this.handlePriceLogo()}
                                </th>
                                <th className="high-price price" onClick={()  => this.handlePriceClick("high_price")}>
                                    High Price
                                    {this.handlePriceLogo()}
                                </th>
                                <th className="market-price price" onClick={()  => this.handlePriceClick("market_price")}>
                                    Market Price
                                    {this.handlePriceLogo()}
                                </th>
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
                                <td colSpan="5">Value</td>
                                <td>${this.handleCount("normal_low_price", "foil_low_price").toFixed(2)}</td>
                                <td>${this.handleCount("normal_mid_price", "foil_mid_price").toFixed(2)}</td>
                                <td>${this.handleCount("normal_high_price", "foil_high_price").toFixed(2)}</td>
                                <td>${this.handleCount("normal_market_price", "foil_market_price").toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </>
        )
    }
}

export default MyCards