import React from 'react'
import ReactHover, {Trigger, Hover} from 'react-hover'
const optionsCursorTrueWithMargin = {followCursor:true, shiftX: 80, shiftY: -280}

export default function MyCardItem(props) {
    return (
        <>
                <tr className="row" key={props.card.id}>
                    <td>
                        {
                            props.editForm && props.editCard.id === props.card.id ?
                                <input
                                    className="edit-input"
                                    type="number"
                                    min="0"
                                    name="amount"
                                    value={props.amount}
                                    onChange={props.handleChange}/>
                                :
                                <p> {props.card.amount} </p>
                        }
                        {
                            props.editForm && props.editCard.id === props.card.id ?
                            <>
                                <button className="submit" onClick={props.handleEditSubmit}> Submit </button>
                                <button onClick={(e) => props.handleClick(e, props.card)}> X </button>
                            </>
                                :
                            <>
                                <button className="edit-card" onClick={(e) => props.handleClick(e, props.card)}> Edit </button>
                                <button className="delete-card" onClick={() => props.handleDelete(props.card)}> Delete </button>
                            </>

                        }
                    </td>
                    <td>
                        <ReactHover options={optionsCursorTrueWithMargin}>
                            <Trigger type="trigger">
                                <p className="hover-me"> {props.card.name} </p>
                            </Trigger>
                            <Hover type="hover">
                                <img src={props.card.img_url} alt={props.card.name}/>
                            </Hover>
                        </ReactHover>
                    </td>
                    <td> {props.card.rarity} </td>
                    {
                        props.card.foil ?
                            <td className="foil">
                                {
                                    props.editForm && props.editCard.id === props.card.id ?
                                        <select name="foil" onChange={props.handleChange}>
                                            <option hidden>Select</option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                        :
                                        <p> Yes </p>
                                }
                            </td>
                            :
                            <td>
                                {
                                    props.editForm && props.editCard.id === props.card.id ?
                                        <select name="foil" onChange={props.handleChange}>
                                            <option hidden>Select</option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                        :
                                        <p> No </p>
                                }
                            </td>
                    }
                    {
                        props.card.binder ?
                        <td> {props.card.binder.name} </td> :
                        <td> It's not within any binder </td>

                    }
                    {
                        props.card.icon ?
                        <td>
                            <div className="icon-div">
                                <img className="icon" src={props.card.icon} alt={`${props.card.name} icon`}/>
                            </div>
                        </td>
                        :
                        <td> No Icon </td>
                    }
                    {props.card.color ?
                         <td className={props.card.color}>{props.card.color}</td>
                         :
                         <td>No info</td>
                    }
                    <td> {props.card.group_name} </td>
                    {
                        props.card.foil ?
                            <>
                                <td> ${props.card.foil_low_price} </td>
                                <td> ${props.card.foil_mid_price} </td>
                                <td> ${props.card.foil_high_price} </td>
                                <td> ${props.card.foil_market_price} </td>
                            </>
                            :
                            <>
                                <td> ${props.card.normal_low_price} </td>
                                <td> ${props.card.normal_mid_price} </td>
                                <td> ${props.card.normal_high_price} </td>
                                <td> ${props.card.normal_market_price} </td>
                            </>
                    }
                </tr>
            </>
    )
}
