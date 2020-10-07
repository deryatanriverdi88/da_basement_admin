import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardItem from "./CardItem"
import { withRouter } from 'react-router-dom'

export default class CardForm extends Component {
    state={
        amount: null,
        cardView: false,
        card: {}
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}
