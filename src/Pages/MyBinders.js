import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyBinderItem from '../Components/MyBinderItem'
import {withRouter} from 'react-router-dom'

class MyBinders extends Component {

    state={
        binderItem: {},
        binderName: "",
        amount: null,
        editForm: false,
        editCard: null,
        editBinderForm: false,
        search: "",
        reversePriceList: "high-to-low"
    }

    componentDidMount = () =>{
        if(this.props.history.location.state && this.props.history.location.state.binder.id){
            this.setState({
                binderItem: this.props.history.location.state.binder
            })
            const sortedCards = this.props.history.location.state.binder.favorite_cards.sort((a,b) => a.name > b.name ? 1 : -1)
            this.props.setFavoriteCards(sortedCards)
            }
        else {
            this.setState({
                binderItem: {}
            })
        }
    }

    handleBinderClick = (e) => {
        let binderItem= this.props.binders.filter(i => {
            return i.id === parseInt(e.target.value)
        })[0]
        this.setState({
            binderItem: binderItem
        })
        const sortedCards = binderItem.favorite_cards.sort((a,b) => a.name > b.name ? 1 : -1)
        this.props.setFavoriteCards(sortedCards)
        this.props.history.push({pathname: `/mybinders/${binderItem.name}`, state: {binder: binderItem}})
    }

    handleEditBinderClick = () => {
        this.setState({
            editBinderForm: !this.state.editBinderForm
        })
    }

    handleAddCardClick = () => {
        this.props.history.push({pathname: `/addCards/${this.state.binderItem.name}`, state: {binder: this.state.binderItem}})
    }

    handleCardDelete = (card) => {
        fetch(`https://da-basement-games-api.herokuapp.com/favorite_cards/${card.id}`, {
        // fetch(`http://localhost:5000/favorite_cards/${card.id}`, {
                  method: 'DELETE'
            }).then(res => {
            const newCards = this.props.favoriteCards.filter(myCard =>{
              return myCard.id !== card.id
           })
           this.props.setFavoriteCards(newCards)
        })
    }

    handleBinderDelete = () => {
        fetch(`https://da-basement-games-api.herokuapp.com/binders/${this.state.binderItem.id}`, {
                  method: 'DELETE'
             }).then(res => {
            const newBinders = this.props.binders.filter(binder =>{
              return binder.id !== this.state.binderItem.id
           })
           this.props.setBinders(newBinders)
           this.props.clearFavoriteCards()
        })
    }

    handleCount = (v1, v2) => {
        let count = 0
        if(this.state.binderItem.id){
            this.props.favoriteCards.map(card =>{
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

    handlePriceClick = (price) => {
        const [normal_low_price, normal_mid_price, normal_high_price, normal_market_price, foil_low_price, foil_mid_price, foil_high_price, foil_market_price] = this.props.favoriteCards
        let newList = []
        if(normal_low_price || normal_mid_price || normal_high_price || normal_market_price){
            if(this.state.reversePriceList === "high-to-low"){
                this.setState({
                    reversePriceList: "low-to-high"
                })
                return newList = [...newList, this.props.favoriteCards.sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  <  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            } else if (this.state.reversePriceList === "low-to-high") {
                this.setState({
                    reversePriceList: "high-to-low"
                })
                return newList = [...newList, this.props.favoriteCards.sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  >  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            }
        } else if(foil_low_price  || foil_mid_price || foil_high_price || foil_market_price) {
            if(this.state.reversePriceList === "high-to-low"){
                this.setState({
                    reversePriceList: "low-to-high"
                })
                return newList = [...newList, this.props.favoriteCards.sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  <  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            } else if (this.state.reversePriceList === "low-to-high") {
                this.setState({
                    reversePriceList: "high-to-low"
                })
               return newList = [...newList, this.props.favoriteCards.sort((a,b ) => (Number.parseFloat(a[`normal_${price}`])  >  Number.parseFloat(b[`normal_${price}`]) ?  1 : -1 ))]
            }
        }
        this.props.setFavoriteCards(newList)
    }

    handleEditSubmit = (e) => {
        e.preventDefault()
        fetch(`https://da-basement-games-api.herokuapp.com/favorite_cards/${this.state.editCard.id}`, {
        // // fetch(`http://localhost:5000/favorite_cards/${this.state.editCard.id}`, {
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
            const newCards = this.props.favoriteCards.map(cardItem => {
                return cardItem.id === card.id ? card : cardItem
            })
            this.setState({
                editCard:  null,
                editForm: false,
                amount: null
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
                name: this.state.binderName
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
               binderName: "",
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
        this.props.favoriteCards.map(card => {
            if(card.name.toLowerCase().startsWith("the ")){
                card.name = card.name.slice(4, card.name.length).concat(', The')
                return card
            } else{
                return card
            }
        })

        const searchedCards = this.props.favoriteCards.filter(card => {
            if(card.name) {
                if (card.name.replace(/^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{2,20}$/).substr(0, this.state.search.length).toLowerCase() === this.state.search.toLowerCase()) {
                    return card
                }
            }
        })

        return (
            <>
                {
                    this.state.binderItem.id ?
                        <h2> Current Binder : {this.state.binderItem.name} </h2> :
                        null
                }
                <select name="binderName" id="binder-name" onChange={this.handleBinderClick}>
                    <option hidden> Select a binder </option>
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
                        <label htmlFor="binderName"> Edit Binder Name : </label>
                        <input type="text" name="binderName" value={this.state.binderName} onChange={this.handleChange}/>
                        <input type="Submit" onClick={this.handleEditBinderSubmit}/>
                    </>
                    :
                    null
                }
                <form className="search-card" htmlFor="search">
                    <label>Search</label>
                    <input className="add-card-input"
                           type="text"
                           name="search"
                           className="search"
                           autoComplete="off"
                           autoCorrect="off"
                           onChange={this.handleChange}
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
                                <th className="set-name"> Set Name </th>
                                <th className="set-icon"> Set Icon </th>
                                <th className="low-price price" onClick={() => this.handlePriceClick("low_price")}>
                                    Low Price
                                    {this.handlePriceLogo()}
                                </th>
                                <th className="mid-price price" onClick={() => this.handlePriceClick("mid_price")}>
                                    Mid Price
                                    {this.handlePriceLogo()}
                                </th>
                                <th className="high-price price" onClick={() => this.handlePriceClick("high_price")}>
                                    High Price
                                    {this.handlePriceLogo()}
                                </th>
                                <th className="market-price price" onClick={() => this.handlePriceClick("market_price")}>
                                    Market Price
                                    {this.handlePriceLogo()}
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
                                <td  colSpan="4"> Value </td>
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
                type: 'SET_FAVORITE_CARDS', payload: card
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        binders: state.addBinders,
        favoriteCards: state.favoriteCards
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyBinders))
