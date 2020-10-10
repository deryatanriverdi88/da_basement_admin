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
                <tr className="row" key={this.props.card.id}>
                <td>{this.props.editForm && this.props.editCard.id === this.props.card.id ?
                        <input type="number" min="0" value={this.props.amount} onChange={this.props.handleChange}/>
                        :
                        <p>{this.props.card.amount}</p>
                    }
                    {this.props.editForm && this.props.editCard.id === this.props.card.id ?
                       <>
                       <button className="edit-card" onClick={this.props.handleEditSubmit}> Submit </button>
                       <button onClick={(e) => this.props.handleClick(e, this.props.card)}> X </button>
                       </>
                        :
                       <button className="edit-card" onClick={(e) => this.props.handleClick(e, this.props.card)}> Edit </button>
                    }
                    </td>
                </tr>
            </>
        )
    }
}
