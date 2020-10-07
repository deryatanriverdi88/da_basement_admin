import React, { Component } from 'react'
import { connect } from 'react-redux'

class AddCards extends Component {

    componentDidMount(){
        fetch('http://localhost:3000/last_ten')
        .then(res=>res.json())
        .then(cardData => {
            this.props.getCards(cardData)
        })
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}
