import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import CardForm from '../Components/CardForm'

class AddCards extends Component {
    state = {
        searchValue: "",
        card: {},
        cardForm: false,
        popUp: false,
        cardNames: [],
        binder: {}
    }

    inputRef = createRef();

    handleChange = (event) => {
        this.setState({
            searchValue: event.target.value
        })
    }

    handlePreventDefault = (e)=>{
        if (e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    }

    updateBinder = (card) => {
        let clonedBinder = JSON.parse(JSON.stringify(this.state.binder))
        if(clonedBinder.favorite_cards){
            clonedBinder.favorite_cards.push(card)
        }
        this.setState({
            binder: clonedBinder
        })
    }

    handleBinderBackClick = () => {
       this.props.history.push({pathname: `/my-binders/${this.state.binder.name}`, state: {binder: this.state.binder}})
    }

    handleClick = (e) => {
        fetch(`https://da-basement-magic-cards-api.herokuapp.com/card?name=${e.target.value}`)
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
        this.inputRef.current.focus();
        this.setState({
            cardForm: !this.state.cardForm,
            searchValue: ""
        })
    }

    handleEscape = (e)=>{
        if(e.keyCode === 27){
            this.inputRef.current.focus();
            this.props.clearCards()
            this.setState({
                cardForm: !this.state.cardForm,
                card: {},
                searchValue: ""
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
        this.inputRef.current.focus();
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

    render() {
        let searchedCardNames =[]
        {
            if(this.state.searchValue.length > 0 ){
                searchedCardNames = this.state.cardNames.filter(name => {
                    if (name.replace(/^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{2,20}$/).substr(0, this.state.searchValue.length).toLowerCase() === this.state.searchValue.toLowerCase()) {
                        return name
                    }
                })
            }
        }
        return (
            <div className="add-card-div">
                <h2>
                    <b> Current Binder  : </b>
                    <button onClick={this.handleBinderBackClick}>
                        { this.state.binder.name }
                    </button>
                </h2>
                <form className="search-card" htmlFor="search">
                    <label> Search </label>
                    <input className="search"
                           type="text"
                           name="search"
                           value={this.state.searchValue}
                           autoComplete="off"
                           autoCorrect="off"
                           autoFocus
                           ref={this.inputRef}
                           onFocus={this.handleChange}
                           onChange={this.handleChange}
                           onKeyDown={this.handlePreventDefault}
                    />
                </form>
                    <select ref={ref => {this.secondInputRef = ref }} name="cardName" style={{width: "30%"}} onChange={this.handleClick} placeholder="Select a card">
                        <option hidden>There are {searchedCardNames.length} names...</option>
                        {
                            searchedCardNames.map((name, i) =>{
                                return <option value={name.replace("â", "a")} key={i+1} >{name}</option>
                            })
                        }
                    </select>
                {
                    this.state.cardForm ?
                        <>
                            <CardForm
                                cards={this.props.cards}
                                handleClick={this.handleClick}
                                handleCardFormTurnOff={this.handleCardFormTurnOff}
                                cardForm={this.state.cardForm}
                                handleClose={this.handleClose}
                                binder={this.state.binder}
                                handleEscape={this.handleEscape}
                                updateBinder={this.updateBinder}
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