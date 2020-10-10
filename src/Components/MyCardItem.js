import React, { Component } from 'react'
import ReactHover, {Trigger, Hover} from 'react-hover'
const optionsCursorTrueWithMargin = {followCursor:true, shiftX: -280, shiftY: -280}

export default class MyCardItem extends Component {
    state = {
        amount: 0
    }

    render() {
        return (
            <>
                <tr className="row" key={this.props.card.id}></tr>
            </>
        )
    }
}
