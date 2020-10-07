import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pages from './Pages'

const Routes = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/'>
                    {localStorage.token ?
                        <Redirect to="/myCards" component={Pages.MyCards}/> :
                        <Pages.Login/>
                    }
                </Route>
                <Route exact path='/myCards' component={Pages.MyCards}>
                    {!localStorage.token ?
                    <Redirect to="/" component={Pages.Login}/> :
                    <Pages.MyCards/>}
                </Route>
                <Route exact path='/addCards' component={Pages.AddCards}></Route>
            </Switch>
        </div>
    )
}

export default Routes