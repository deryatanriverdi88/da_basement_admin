import React, { Component } from 'react'
import MyCardItem from '../Components/MyCardItem'
const RARITIES = [ "Common", "Land", "Uncommon","Mythic",  "Promo", "Special", "Rare", "Token"]


class MyCards extends Component {
    state={
        myCards: [],
        amount: null,
        foil: null,
        editForm: false,
        editCard: {},
        searchValue: "",
        rarity: "all-rarities",
        setName: "all-sets",
        isFoil: "all-types",
        setNames: [],
        binderNames: [], 
        binderName: "all-binders",
        cardsWithRarity : [],
        cardsWithSetName: [],
        cardsWithBinderName: [],
        cardsWithIsfoil: [],
        cardDeleted: {},
        attribute: "",
        value: ""
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
                [e.target.name]: e.target.value,
                attribute: e.target.name,
                value: e.target.value
            })
        if(e.target.name === 'rarity'){
            this.setState({
                 setName: "all-sets",
                 binderName: "all-binders",
                 isFoil: "all-types"
            })
        }else if(e.target.name === 'setName'){
            this.setState({
                rarity: "all-rarities",
                binderName: "all-binders",
                isFoil: "all-types"
            })
        }else if(e.target.name === 'binderName'){
            this.setState({
                rarity: "all-rarities",
                setName: "all-sets",
                isFoil: "all-types"
            })
        }else if(e.target.name === "isFoil"){
            this.setState({
                rarity: "all-rarities",
                setName: "all-sets",
                binderName: "all-binders",
            })
        }
        this.fetchCardsWithAttribute(e.target.name, e.target.value)
    }

    handleFilterClick = () => {
        this.setState({
            rarity: "all-rarities",
            setName: "all-sets",
            isFoil: "all-types",
            binderName: "all-binders"
        })
        this.cardsToRender()
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
            } else if(att === "isFoil"){
                const newCards = this.state.myCards.filter(card => {
                    if(value === "true"){
                        if(card.foil === true){
                            return card
                        }
                    }else if(value === "false"){
                        if(card.foil === false){
                            return card
                        }
                    }
                })
                this.setState({
                    cardsWithIsfoil: newCards
                })
            }
        })
    }

    cardsToMap = (att) => {
        const {cardsWithRarity, cardsWithBinderName , cardsWithIsfoil, cardsWithSetName} = this.state
        let arrayToMap = []
        if(att === "rarity"){
           return arrayToMap = cardsWithRarity
        }else if(att === "binderName"){
            return arrayToMap = cardsWithBinderName
        }else if(att === "isFoil"){
            return arrayToMap = cardsWithIsfoil
        }else if(att === "setName"){
            return arrayToMap = cardsWithSetName
        }
        return arrayToMap
    }

    cardsAfterEdition = (attr, editedCard=`${this.state.editCard}`, deletedCard=`${this.state.cardDeleted}`) =>{
        let newCards = []
        if(editedCard.id){
            newCards = this.cardsToMap(attr).map(cardItem => {
                    return cardItem.id === editedCard.id ? editedCard : cardItem
                })
        }else if (deletedCard.id){
            newCards = this.cardsToMap(attr).filter(myCard =>{
                    return myCard.id !== deletedCard.id
                })
        }
        else {
            newCards = this.cardsToMap(attr)
        }
        return newCards
    }

    cardsToRender = () => {
        if(this.state.setName === "all-sets" && this.state.rarity === "all-rarities" && this.state.binderName === "all-binders" && this.state.isFoil === "all-types"){
            return this.state.myCards
        }else if(this.state.rarity !== "all-rarities"){
            return this.state.cardsWithRarity
        }else if(this.state.setName !== "all-sets"){
            return this.state.cardsWithSetName
        }else if(this.state.binderName !== "all-binders"){
            return this.state.cardsWithBinderName
        }else if(this.state.isFoil !== "all-types"){
            return this.state.cardsWithIsfoil
        }
    }

    filterByBinder = () => {
            const newCards = this.state.myCards.filter(card =>{
                if(this.state.binderName === 'no-binder'){
                    if(card.binder === null){
                        return card
                    }
                }else {
                    if(card.binder !== null){
                        if(card.binder.name === this.state.binderName){
                            return card
                        }
                    }
                }
            })
        this.setState({
            cardsWithBinderName: newCards
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
                       count = count
                        if(card[v2] === null){
                            count = count
                        }else {
                            count += Number.parseFloat(card[v2] * card.amount)
                        }
                    } else if(!card.foil){
                        count = count
                        if(card[v1] === null){
                            count = count
                        }else {
                            count += Number.parseFloat(card[v1] * card.amount)
                        }
                    }
                }
            })
        }
        return count
    }

    handlePriceAndAmountClick = (value, reversePriceListType) => {
        let newList = []
        if(value === "amount") {
            if(reversePriceListType === "high"){
                newList = this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[value])  <  Number.parseFloat(b[value]) ?  1 : -1 ))
            } else if (reversePriceListType === "low") {
                newList = this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[value])  > Number.parseFloat(b[value]) ?  1 : -1 ))
            }
        } else if(value === "name"){
            if(reversePriceListType === "high"){
                newList = this.cardsToRender().sort((a,b ) => (a[value]  <  b[value] ?  1 : -1 ))
            } else if (reversePriceListType === "low") {
                newList = this.cardsToRender().sort((a,b ) => (a[value] > b[value] ?  1 : -1 ))
            }
        }else {
            if(reversePriceListType === "high"){
                newList = this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[`normal_${value}`] || a[`foil_${value}`])  <  Number.parseFloat(b[`normal_${value}`] || b[`foil_${value}`]) ?  1 : -1 ))
            }else if (reversePriceListType === "low") {
                newList = this.cardsToRender().sort((a,b ) => (Number.parseFloat(a[`normal_${value}`] || a[`foil_${value}`])  >  Number.parseFloat(b[`normal_${value}`] || b[`foil_${value}`]) ?  1 : -1 ))
            }
        }
        this.setState({
            myCards: newList
        })
    }

    renderPriceLogo = (value) => {
        return <>
                <img src="https://img.icons8.com/ultraviolet/15/000000/up-squared.png" alt="up-arrow" onClick={()  => this.handlePriceAndAmountClick(value, "high")}/>
                <img src="https://img.icons8.com/ultraviolet/15/000000/down-squared.png" alt="down-arrow" onClick={()  => this.handlePriceAndAmountClick(value, "low")}/>
            </>
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
           amount: this.state.amount,
           foil: this.state.foil
          })
        })
        .then(res => res.json())
        .then(card => {
            const newCards =  this.state.myCards.map(cardItem => {
              return cardItem.id === card.id ? card : cardItem
          })
          const updatedCards = this.cardsAfterEdition(this.state.attribute, card, {})
          this.setState({
            editCard:card,
            myCards:  newCards,
            editForm: false,
            amount: null,
            foil: null,
            cardsWithBinderName: updatedCards,
            cardsWithIsfoil: updatedCards ,
            cardsWithSetName: updatedCards,
            cardsWithRarity: updatedCards
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
           const updatedCards = this.cardsAfterEdition(this.state.attribute, {},card,)
           this.setState({
            myCards: newCards,
            cardDeleted: card,
            cardsWithBinderName: updatedCards,
            cardsWithIsfoil: updatedCards ,
            cardsWithSetName: updatedCards,
            cardsWithRarity: updatedCards
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
                if (card.name.replace(/^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{2,20}$/).substr(0, this.state.searchValue.length).toLowerCase() === this.state.searchValue.toLowerCase()) {
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
                <button onClick={this.handleFilterClick}>Clear Filter</button>
                <div className="table">
                    <table>
                        <thead>
                            <tr className="row">
                                <th className="amount">
                                    Amount
                                    {this.renderPriceLogo("amount")}
                                    </th>
                                <th className="name">
                                    Card Name
                                    {this.renderPriceLogo("name")}
                                </th>
                                <th className="rarity">
                                    <select name="rarity" value={this.state.rarity}onChange={this.handleDropdownChange}>
                                        <option value="all-rarities" key="all"> All Rarities </option>
                                            {
                                                RARITIES.map(rarity => {
                                                   return <option value={rarity} key={rarity}> {rarity} </option>
                                                })
                                            }
                                    </select>
                                </th>
                                <th className="foiled">
                                    <select name="isFoil" value={this.state.isFoil} onChange={this.handleDropdownChange}>
                                            <option value="all-types" key="all"> All Types</option>
                                            <option value={true}> Foil </option>
                                            <option value={false}> Non Foil</option>
                                    </select>
                                </th>
                                <th className="binder-name">
                                <select name="binderName" value={this.state.binderName} onChange={this.handleDropdownChange}>
                                        <option value="all-binders" key="all">All Binders</option>
                                        <option value="no-binder"> No Binder</option>
                                            {
                                                this.state.binderNames.map(binder => {
                                                    return <option value={binder.name} key={binder.name}> {binder.name} </option>
                                                })
                                            }
                                    </select>
                                </th>
                                <th className="set-icon"> Set Icon </th>
                                <th className="set-name">
                                <select name="setName" value={this.state.setName} onChange={this.handleDropdownChange}>
                                        <option value="all-sets" key="all"> All Sets </option>
                                            {
                                                this.state.setNames.map(card => {
                                                    return <option value={card.group_name} key={card.group_name}> {card.group_name} </option>
                                                })
                                            }
                                    </select>
                                </th>
                                <th className="low-price price">
                                    Low Price
                                    {this.renderPriceLogo("low_price")}
                                </th>
                                <th className="mid-price price">
                                    Mid Price
                                    {this.renderPriceLogo("mid_price")}
                                </th>
                                <th className="high-price price">
                                    High Price
                                    {this.renderPriceLogo("high_price")}
                                </th>
                                <th className="market-price price">
                                    Market Price
                                    {this.renderPriceLogo("market_price")}
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