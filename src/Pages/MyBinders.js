import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyBinderItem from '../Components/MyBinderItem'
import {withRouter} from 'react-router-dom'
const RARITIES = [ "Common", "Land", "Uncommon","Mythic",  "Promo", "Special", "Rare", "Token"]

class MyBinders extends Component {

    state={
        binderItem: {},
        binderInputName: "",
        amount: null,
        foil: null,
        color: null,
        editForm: false,
        editCard: null,
        editBinderForm: false,
        search: "",
        rarity: "all-rarities",
        setName: "all-sets",
        isFoil: "all-types",
        colorName: "not-selected",
        cardsWithRarity : [],
        cardsWithSetName: [],
        cardsWithIsfoil: [],
        cardsWithColors: [],
        cardDeleted: {},
        attribute: "",
        value: "",
        groupNames: [],
        priceOrAmountClicked: false,
        alert: false

    }

    setGroupNames = () => {
        let groupNames = []
        if(this.props.binderFavoriteCards){
            this.props.binderFavoriteCards.forEach(card => {
                groupNames.push(card.group_name)
            })
        }
        let removedDublicates = [...new Set(groupNames)]
        return removedDublicates.sort((a,b) => a > b ? 1 : -1)
    }

    setColors = () => {
        let colors = []
        if(this.props.binderFavoriteCards){
            this.props.binderFavoriteCards.forEach(card => {
                colors.push(card.color)
            })
        }
        let removedDublicates = [...new Set(colors)]
        return removedDublicates.sort((a,b) => a > b ? 1 : -1)
    }

    componentDidMount = () =>{
        if(this.props.history.location.state && this.props.history.location.state.binder.id){
            fetch(`https://da-basement-games-api.herokuapp.com/binders/${this.props.history.location.state.binder.id}`)
            .then(res => res.json())
            .then(binderObj => {
                const sortedCards = binderObj.favorite_cards.sort((a,b) => a.name > b.name ? 1 : -1)
                this.props.setFavoriteCards(sortedCards)
                this.setState({
                    binderItem: binderObj
                })
                this.setGroupNames()
                this.setColors()
             })
            }
        else {
            this.setState({
                binderItem: {}
            })
        }
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
                 isFoil: "all-types",
                 colorName: "not-selected"
            })
        }else if(e.target.name === 'setName'){
            this.setState({
                rarity: "all-rarities",
                isFoil: "all-types",
                colorName: "not-selected"
            })
        }else if(e.target.name === "isFoil"){
            this.setState({
                rarity: "all-rarities",
                setName: "all-sets",
                colorName: "not-selected"
            })
        }else if(e.target.name === "colorName"){
            this.setState({
                rarity: "all-rarities",
                setName: "all-sets",
                isFoil: "all-types"
            })
        }
        this.fetchCardsWithAttribute(e.target.name, e.target.value)
    }

    handleFilterClick = () => {
        this.setState({
            rarity: "all-rarities",
            setName: "all-sets",
            isFoil: "all-types",
            colorName: "not-selected"
        })
        this.cardsToRender()
    }

    fetchCardsWithAttribute = (att, value) => {
        this.setState({
            cardsWithRarity: [],
            cardsWithSetName: [],
            cardsWithIsfoil: [],
            cardsWithColors: []
        })
        fetch(`https://da-basement-games-api.herokuapp.com/cards_with_binder?${att}=${value}&binder=${this.state.binderItem.id}`)
        .then(res => res.json())
        .then(cardObj => {
            if(att === "rarity"){
                this.setState({
                    cardsWithRarity: cardObj
                })
            } else if(att === "setName" ){
                this.setState({
                    cardsWithSetName: cardObj
                })
            }else if(att === "colorName"){
                this.setState({
                    cardsWithColors: cardObj
                })
            }else if(att === "isFoil"){
                let newCards = []
                 this.props.binderFavoriteCards.filter(card => {
                    if(value === "true"){
                        if(card.foil === true){
                            newCards.push(card)
                        }
                    }else if(value === "false"){
                        if(card.foil === false){
                            newCards.push(card)
                        }
                    }
                    return newCards
                })
                this.setState({
                    cardsWithIsfoil: newCards
                })
            }
        })
    }

    cardsToMap = (att) => {
        const {cardsWithRarity, cardsWithIsfoil, cardsWithSetName, cardsWithColors} = this.state
        let arrayToMap = []
        if(att === "rarity"){
           return arrayToMap = cardsWithRarity
        }else if(att === "isFoil"){
            return arrayToMap = cardsWithIsfoil
        }else if(att === "setName"){
            return arrayToMap = cardsWithSetName
        }else if(att === "colorName"){
            return arrayToMap = cardsWithColors
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
        if(this.state.setName === "all-sets" && this.state.rarity === "all-rarities" && this.state.isFoil === "all-types" && this.state.colorName === "not-selected"){
            return this.props.binderFavoriteCards
        }else if(this.state.rarity !== "all-rarities"){
            return this.state.cardsWithRarity
        }else if(this.state.setName !== "all-sets"){
            return this.state.cardsWithSetName
        }else if(this.state.isFoil !== "all-types"){
            return this.state.cardsWithIsfoil
        }else if(this.state.colorName !== "not-selected"){
            return this.state.cardsWithColors
        }
    }

    handlePriceAndAmountClick = (value, reversePriceListType) => {
        console.log(value, reversePriceListType)
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
        this.props.setFavoriteCards(newList)
        this.setState({
            priceOrAmountClicked: !this.state.priceOrAmountClicked
        })
    }

    renderPriceLogo = (value) => {
        return <>
                <img src="https://img.icons8.com/ultraviolet/15/000000/up-squared.png" alt="up-arrow" onClick={()  => this.handlePriceAndAmountClick(value, "high")}/>
                <img src="https://img.icons8.com/ultraviolet/15/000000/down-squared.png" alt="down-arrow" onClick={()  => this.handlePriceAndAmountClick(value, "low")}/>
            </>
    }

    handleBinderClick = (e) => {
        let binderItem= this.props.binders.filter(i => {
            return i.id === parseInt(e.target.value)
        })[0]
        this.setState({
            binderItem: binderItem
        })
        this.handleFilterClick()
        let sortedCards = binderItem.favorite_cards.sort((a,b) => a.name > b.name ? 1 : -1)
        this.props.setFavoriteCards(sortedCards)
        this.setGroupNames()
        this.setColors()
        this.props.history.push({pathname: `/my-binders/${binderItem.name}`, state: {binder: binderItem}})
    }

    handleEditBinderClick = () => {
        this.setState({
            editBinderForm: !this.state.editBinderForm,
            binderInputName: this.state.binderItem.name
        })
    }

    handleAddCardClick = () => {
        this.props.history.push({pathname: `/add-cards/${this.state.binderItem.name}`, state: {binder: this.state.binderItem}})
    }

    handleCardDelete = (card) => {
        fetch(`https://da-basement-games-api.herokuapp.com/favorite_cards/${card.id}`, {
                  method: 'DELETE'
            }).then(res => {
            const newCards = this.props.binderFavoriteCards.filter(myCard =>{
              return myCard.id !== card.id
           })
           const updatedCards = this.cardsAfterEdition(this.state.attribute, {},card,)
           this.props.setFavoriteCards(newCards)
           this.setState({
            cardDeleted: card,
            cardsWithBinderName: updatedCards,
            cardsWithIsfoil: updatedCards ,
            cardsWithSetName: updatedCards,
            cardsWithRarity: updatedCards,
            cardsWithColors: updatedCards
          })
        })
    }

    handleBinderDelete = () => {
        window.alert('You are deleting this binder permanently, are you sure?')
        window.addEventListener(this.setState({alert: true}))
        setTimeout(() => {
            this.deleteBinder()
        }, 50)
    }

    deleteBinder = () => {
        if(this.state.alert){
            fetch(`https://da-basement-games-api.herokuapp.com/binders/${this.state.binderItem.id}`, {
                method: 'DELETE'
            }).then(res => {
            const newBinders = this.props.binders.filter(binder =>{
                return binder.id !== this.state.binderItem.id
            })
            this.setState({
                binderItem: {},
                alert: false
            })
            this.props.history.push({pathname: `/my-binders`})
            this.props.setBinders(newBinders)
            this.props.clearFavoriteCards()
            })
        }
    }

    handleCount = (v1, v2) => {
        let count = 0
        if(this.state.binderItem.id){
            this.props.binderFavoriteCards.forEach(card =>{
                if(v1 === "amount"){
                    count += card[v1]
                 }else{
                     if(card.foil){
                         if(card[v2] === null){
                            return null
                         }else {
                             count += Number.parseFloat(card[v2] * card.amount)
                         }
                     } else if(!card.foil){
                         if(card[v1] === null){
                             return null
                         }else {
                             count += Number.parseFloat(card[v1] * card.amount)
                         }
                     }
                 }
            })
        }
        return count
    }

    handleClick = (e, card) => {
        this.setState({
            amount: card.amount,
            foil: card.foil,
            editForm: !this.state.editForm,
            editCard: card
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEditSubmit = (e) => {
        e.preventDefault()
        fetch(`https://da-basement-games-api.herokuapp.com/favorite_cards/${this.state.editCard.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json'
          },
            body: JSON.stringify({
               amount: this.state.amount,
               foil: this.state.foil,
               color: this.state.color
          })
        })
        .then(res => res.json())
        .then(card => {
            const newCards = this.props.binderFavoriteCards.map(cardItem => {
                return cardItem.id === card.id ? card : cardItem
            })
            const updatedCards = this.cardsAfterEdition(this.state.attribute, card, {})
            this.setState({
                editCard:  card,
                editForm: false,
                amount: null,
                foil: null,
                color: null,
                cardsWithBinderName: updatedCards,
                cardsWithIsfoil: updatedCards ,
                cardsWithSetName: updatedCards,
                cardsWithRarity: updatedCards,
                cardsWithColors: updatedCards
                })
            this.props.setFavoriteCards(newCards)
        })
    }

    handleEditBinderSubmit = (e) =>{
        e.preventDefault()
        fetch(`https://da-basement-games-api.herokuapp.com/binders/${this.state.binderItem.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify({
                name: this.state.binderInputName
            })
        })
        .then(res => res.json())
        .then(binder => {
            const newBinders = this.props.binders.map(binderItem => {
                return binderItem.id === binder.id ? binder : binderItem
            })
            this.props.setBinders(newBinders)
            this.setState({
               binderItem: binder,
               binderInputName: "",
               editBinderForm: !this.state.editBinderForm
           })
        })
    }

    handlePriceLogo = () => {
        if(this.state.reversePriceList === 'high-to-low'){
            return <img src="https://img.icons8.com/ultraviolet/20/000000/up-squared.png" alt="up-arrow"/>
        } else {
            return <img src="https://img.icons8.com/ultraviolet/20/000000/down-squared.png" alt="down-arrow"/>
        }
    }

    render() {
        let newNames = []
        if(this.cardsToRender()){
           this.cardsToRender().map(card => {
                if(card.name.toLowerCase().startsWith("the ")){
                    card.name = card.name.slice(4, card.name.length).concat(', The')
                    newNames.push(card)
                } else{
                    newNames.push(card)
                }
                return newNames
            })
        }

        let searchedCards = []

        newNames.filter(card => {
            if(card.name) {
                if (card.name.replace(/^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{2,20}$/).substr(0, this.state.search.length).toLowerCase() === this.state.search.toLowerCase()) {
                    searchedCards.push(card)
                }
            }
            return searchedCards
        })

        return (
            <>
                {
                    this.state.binderItem.id ?
                        <h2> Current Binder : {this.state.binderItem.name} </h2> :
                        null
                }
                <select name="binderInputName" id="binder-name" onChange={this.handleBinderClick}>
                    <option hidden> {this.state.binderItem.id ? this.state.binderItem.name: 'Select a binder'}  </option>
                    {
                        this.props.binders.length > 0 ?
                            this.props.binders.map(binder => {
                                return <option value={binder.id} key={binder.id}> {binder.name} </option>
                            }) :
                            null
                    }
                </select>
                {
                    this.state.binderItem.id ?
                    <>
                        <button onClick={this.handleAddCardClick}> Add cards to this binder </button>
                        <button onClick={this.handleEditBinderClick}> Edit this binder </button>
                        <button onClick={this.handleBinderDelete}> Delete Collection </button>
                    </> :
                    null
                }

                {
                    this.state.editBinderForm ?
                    <>
                        <br></br>
                        <label htmlFor="binderInputName"> Edit Binder Name : </label>
                        <input type="text" name="binderInputName" value={this.state.binderInputName} onChange={this.handleChange}/>
                        <input type="Submit" onClick={this.handleEditBinderSubmit}/>
                    </>
                    :
                    null
                }
                <form className="search-card" htmlFor="search">
                    <label>Search</label>
                    <input className="add-card-input search"
                           type="text"
                           name="search"
                           autoComplete="off"
                           autoCorrect="off"
                           onChange={this.handleChange}
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
                                <th className="set-name">
                                <select name="setName" value={this.state.setName} onChange={this.handleDropdownChange}>
                                        <option value="all-sets" key="all"> All Sets </option>
                                            {
                                                this.setGroupNames().map(name => {
                                                    return <option value={name} key={name}> {name} </option>
                                                })
                                            }
                                    </select>
                                </th>
                                <th className="set-icon"> Set Icon </th>
                                <th className="color">
                                    <select name="colorName" value={this.state.colorName} onChange={this.handleDropdownChange}>
                                            <option value="not-selected" key="all"> Pick a color </option>
                                                {
                                                    this.setColors().map(color => {
                                                    return <option value={color} key={color}> {color} </option>
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
                              this.state.binderItem.id ?
                              searchedCards.map((card)=>{
                                   return <MyBinderItem card={card}
                                                        key={card.id}
                                                        handleClick={this.handleClick}
                                                        editForm={this.state.editForm}
                                                        amount={this.state.amount}
                                                        handleChange={this.handleChange}
                                                        editCard={this.state.editCard}
                                                        handleEditSubmit={this.handleEditSubmit}
                                                        handleCardDelete={this.handleCardDelete}
                                          />
                                })
                                 :
                                null
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td> Total Cards </td>
                                <td> {this.handleCount('amount')} </td>
                                <td  colSpan="5"> Value </td>
                                <td> ${this.handleCount("normal_low_price", "foil_low_price").toFixed(2)} </td>
                                <td> ${this.handleCount("normal_mid_price", "foil_mid_price").toFixed(2)} </td>
                                <td> ${this.handleCount("normal_high_price", "foil_high_price").toFixed(2)} </td>
                                <td> ${this.handleCount("normal_market_price", "foil_market_price").toFixed(2)} </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        setBinders: (binderObject) => {
            dispatch({
                type: 'SET_BINDERS', payload: binderObject
            })
        },
        clearBinder: () => {
            dispatch({
                type: 'CLEAR_BINDER'
            })
        },
        clearFavoriteCards: () => {
            dispatch({
                type: 'CLEAR_FAVORITE_CARDS'
            })
        },
        setFavoriteCards: (card) => {
            dispatch({
                type: 'SET_BINDER_FAVORITE_CARDS', payload: card
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        binders: state.addBinders,
        binderFavoriteCards: state.favoriteCards.binderFavoriteCards
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyBinders))