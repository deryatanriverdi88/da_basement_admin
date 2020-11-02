import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardForm from '../Components/CardForm'
import PopUp from '../Components/PopUp'

class AddCards extends Component {
    state = {
        searchValue: "",
        card: {},
        cardForm: false,
        popUp: false,
        cardNames: [],
        binder: {},
    }

    handleChange = (event) => {
        this.setState({
            searchValue: event.target.value
        })
    }

    handleClick = (e) => {
        fetch(`http://localhost:4000/card?name=${e.target.value}`)
        .then(res => res.json())
        .then(cardItem => {
            this.props.getCards(cardItem)
        })
        this.setState({
            cardForm: !this.state.cardForm
        })
    }

    handleClose = () => {
        this.props.clearCards()
        this.setState({
            cardForm: !this.state.cardForm
        })

    }
    handleEscape = (e)=>{
        if(e.keyCode === 27){
            this.props.clearCards()
            this.setState({
                cardForm: !this.state.cardForm,
                card: {}
            })
        }
    }

    handleCardFormTurnOff = (card)=> {
        this.setState({
            cardForm: false,
            popUp: true,
            card: card
        })
    }

    componentDidUpdate = () =>{
        if(this.state.popUp){
            setTimeout(() => this.setState({popUp: false}), 300)
        }
        if(this.props.history.location.state){
            if(this.props.history.location.state.binder.id !== this.state.binder.id){
                this.setState({
                    binder: this.props.history.location.state.binder
                })
            }
        }
    }

    componentDidMount(){
        fetch('https://api.scryfall.com/catalog/card-names')
        .then(res => res.json())
        .then(cardNames => {
            const newNames = cardNames.data.map(name => {
                if(name.includes("//")){
                    let i = name.indexOf("//")
                    return name.slice(0, i-1)
                } else{
                    return name
                }
            })
            this.setState({
                cardNames: newNames
            })
        })
        if(this.props.history.location.state){
            this.setState({
                binder: this.props.history.location.state.binder
            })
        }
    }

    // renderPopUp = (cond) => {
    //     if(cond === true){
    //        return  <PopUp card={this.state.card} />
    //     } else if(cond === false) {
    //        return null
    //     }
    // }

    render() {
        let searchedCardNames =[]
        {
            if(this.state.searchValue.length > 0 ){
                searchedCardNames = this.state.cardNames.filter(card => {
                    if (card.replace(/[^a-zA-Z0-9]/g, "").substr(0, this.state.searchValue.length).toLowerCase() === this.state.searchValue.toLowerCase()) {
                        return card
                    }
                })
            }
        }
        return (
            <div className="add-card-div">
                <h2>
                    <b> Current Binder  : </b>
                    { this.state.binder.name }
                </h2>
                <form className="search-card" htmlFor="search">
                    <label> Search </label>
                    <input className="search"
                           type="text"
                           name="search"
                           autoComplete="off"
                           autoCorrect="off"
                           onFocus={this.handleChange}
                           onChange={this.handleChange}
                    />
                </form>
                {
                    this.renderPopUp(this.state.popUp)
                }
                <div className="cardlist">
                    {
                        this.state.searchValue.length > 0 ?
                            searchedCardNames.map((name,i )=> {
                                return  <li onClick={() => this.handleClick(name)} key={i}> {name} </li>
                            }) :
                            null
                    }
                </div>
                {
                    this.state.cardForm ?
                        <>
                            <CardForm
                                cards={this.props.cards}
                                cardName={this.state.cardName}
                                handleClick={this.handleClick}
                                handleCardFormTurnOff={this.handleCardFormTurnOff}
                                cardForm={this.state.cardForm}
                                handleClose={this.handleClose}
                                binder={this.state.binder}
                            />
                        </>
                        :
                        null
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCards: (cardObject) => {
            dispatch({
                type: 'GET_CARDS', payload: cardObject
            })
        },
        clearCards: () => {
            dispatch({
                type: 'CLEAR_CARDS'
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        cards: state.addCards
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCards)