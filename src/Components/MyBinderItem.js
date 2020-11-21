import React from 'react'
import ReactHover, {Trigger, Hover} from 'react-hover'
const optionsCursorTrueWithMargin = {followCursor:true, shiftX: 80, shiftY: -280}
const COLORS = ['Red', "Green", "Blue", "Black", "White", "Multicolor", "Colorless"]

export default function MyBinderItem(props){
        return (
            <>
                <tr className="row" key={props.card.id}>
                    <td>
                        {
                            props.editForm && props.editCard.id === props.card.id ?
                                <input className="edit-input" type="number" min="0" value={props.amount} name="amount" onChange={props.handleChange}/>
                                :
                                <p> {props.card.amount} </p>
                        }
                        {
                            props.editForm && props.editCard.id === props.card.id ?
                                <>
                                    <input className="submit" type="Submit" onClick={props.handleEditSubmit}/>
                                    <button onClick={(e) => props.handleClick(e, props.card)}> X </button>
                                </>
                                    :
                                <>
                                    <button className="edit-card" onClick={(e) => props.handleClick(e, props.card)}> Edit </button>
                                    <button className="delete-card" onClick={() => props.handleCardDelete(props.card)}> Delete </button>
                                </>
                        }
                    </td>
                    <td>
                        <ReactHover options={optionsCursorTrueWithMargin}>
                            <Trigger type="trigger">
                                <p className="hover-me">{props.card.name}</p>
                            </Trigger>
                            <Hover type="hover">
                                <img src={props.card.img_url} alt={props.card.name}/>
                            </Hover>
                        </ReactHover>
                    </td>
                    <td>{props.card.rarity} </td>
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
                    <td> {props.card.group_name}</td>
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
                         <td className={props.card.color}>
                             {
                                props.editForm && props.editCard.id === props.card.id ?
                                <select name="color" onChange={props.handleChange}>
                                    <option hidden>Select color</option>
                                    {
                                        COLORS.map(color =>{
                                            return <option value={color} key={color}>{color}</option>
                                        })
                                    }
                                </select>
                                 :
                                props.card.color
                             }
                             </td>
                         :
                         <td>
                             {
                                props.editForm && props.editCard.id === props.card.id ?
                                    <select name="color" onChange={props.handleChange}>
                                        <option hidden>Select color</option>
                                        {
                                            COLORS.map(color =>{
                                                return <option value={color} key={color}>{color}</option>
                                            })
                                        }
                                    </select>
                                    :
                                    <p> No info </p>
                                }
                         </td>
                    }
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