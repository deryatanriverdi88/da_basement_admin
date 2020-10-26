import React, { Component } from 'react'
import ReactHover, {Trigger, Hover} from 'react-hover'
const optionsCursorTrueWithMargin = {followCursor:true, shiftX: -280, shiftY: -280}

export default class MyCardItem extends Component {

    render() {
        return (
            <>
                <tr className="row" key={this.props.card.id}>
                    <td>
                        {
                            this.props.editForm && this.props.editCard.id === this.props.card.id ?
                                <input
                                    className="edit-input"
                                    type="number"
                                    min="0"
                                    value={this.props.amount}
                                    onChange={this.props.handleChange}/>
                                :
                                <p> {this.props.card.amount} </p>
                        }
                        {
                            this.props.editForm && this.props.editCard.id === this.props.card.id ?
                            <>
                                <button className="submit" onClick={this.props.handleEditSubmit}> Submit </button>
                                <button onClick={(e) => this.props.handleClick(e, this.props.card)}> X </button>
                            </>
                                :
                            <>
                                <button className="edit-card" onClick={(e) => this.props.handleClick(e, this.props.card)}> Edit </button>
                                <button className="delete-card" onClick={() => this.props.handleDelete(this.props.card)}> Delete </button>
                            </>

                        }
                    </td>
                    <td>
                        <ReactHover options={optionsCursorTrueWithMargin}>
                            <Trigger type="trigger">
                                <p className="hover-me"> {this.props.card.name} </p>
                            </Trigger>
                            <Hover type="hover">
                                <img src={this.props.card.img_url} alt={this.props.card.name}/>
                            </Hover>
                        </ReactHover>
                    </td>
                    <td> {this.props.card.rarity} </td>
                    {
                        this.props.card.foil ?
                            <td> Yes </td>
                            :
                            <td> No </td>
                    }
                    {
                        this.props.card.binder ?
                        <td> {this.props.card.binder.name} </td> :
                        <td> It's not within any binder </td>

                    }
                    {
                        this.props.card.icon ?
                        <td>
                            <div className="icon-div">
                                <img className="icon" src={this.props.card.icon} alt={`${this.props.card.name} icon`}/>
                            </div>
                        </td>
                        :
                        <td> No Icon </td>
                    }
                    <td> {this.props.card.group_name} </td>
                    {
                        this.props.card.foil ?
                            <>
                                <td> ${this.props.card.foil_low_price} </td>
                                <td> ${this.props.card.foil_mid_price} </td>
                                <td> ${this.props.card.foil_high_price} </td>
                                <td> ${this.props.card.foil_market_price} </td>
                            </>
                            :
                            <>
                                <td> ${this.props.card.normal_low_price} </td>
                                <td> ${this.props.card.normal_mid_price} </td>
                                <td> ${this.props.card.normal_high_price} </td>
                                <td> ${this.props.card.normal_market_price} </td>
                            </>
                    }
                </tr>
            </>
        )
    }
}
