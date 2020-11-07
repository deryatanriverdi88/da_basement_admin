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
                <Route exact path='/addCards/:binder' component={Pages.AddCards}></Route>
                <Route exact path='/mybinders' component={Pages.MyBinders}></Route>
                <Route exact path="/mybinders/:binder" component={Pages.MyBinders}></Route>
            </Switch>
        </div>
    )
}

export default Routes