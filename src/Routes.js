import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pages from './Pages'

const Routes = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/'>
                    {localStorage.token ?
                        <Redirect to="/my-cards" component={Pages.MyCards}/> :
                        <Pages.Login/>
                    }
                </Route>
                {!localStorage.token ?
                <Redirect to="/" component={Pages.Login}/> :
                <>
                    <Route exact path='/my-cards' component={Pages.MyCards}></Route>
                    <Route exact path='/add-cards' component={Pages.AddCards}></Route>
                    <Route exact path='/add-cards/:binder' component={Pages.AddCards}></Route>
                    <Route exact path='/my-binders' component={Pages.MyBinders}></Route>
                    <Route exact path='/my-binders/:binder' component={Pages.MyBinders}></Route>
                </>
                }
            </Switch>
        </div>
    )
}

export default Routes