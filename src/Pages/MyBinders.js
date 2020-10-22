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
        editCard: null
    }

    handleBinderClick = (e) => {
        let binderItem= this.props.binders.filter(i => {
            return i.id === parseInt(e.target.value)
        })[0]
        this.setState({
            binderItem: binderItem
        })
        this.props.setFavoriteCards(binderItem.favorite_cards)
    }

    handleAddCardClick = () => {
        this.props.history.push({pathname: `/addCards/${this.state.binderItem.name}`, state: {binder: this.state.binderItem}})
    }

    handleDelete = () => {
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
    render() {
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
                        <button onClick={this.handleEditCardClick}> Edit this binder </button>
                    </> :
                    null
                }
                <button onClick={this.handleDelete}> Delete Collection </button>
                <div className="table">
                        <table>
                            <thead>
                                <tr className="row">
                                <th className="amount"> Amount </th>
                                <th className="name"> Card Name </th>
                                <th className="rarity"> Rarity </th>
                                <th className="foiled"> Foiled </th>
                                <th className="set-name"> et Name </th>
                                <th className="low-price"> Low Price </th>
                                <th className="mid-price"> Mid Price </th>
                                <th className="high-price"> High Price </th>
                                <th className="market-price"> Market Price </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                              this.state.binderItem.id ?
                              this.props.favoriteCards.map((card)=>{
                                   return <MyBinderItem card={card}
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
                                <td> Total Cards </td>
                                <td> {this.handleCount('amount')} </td>
                                <td colSpan="3"> Value </td>
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
