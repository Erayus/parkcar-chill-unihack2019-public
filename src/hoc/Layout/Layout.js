import React, {Component} from "react";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import classes from './Layout.module.css';
import Map from '../../containers/Map/Map';
import Account from '../../containers/Account/Account'
import { Switch, Route, Redirect } from "react-router-dom";


class Layout extends Component  {
    state = {
        isDrawerOpen: false
    };

    closeSideDrawerHandler = () =>{
        this.setState({isDrawerOpen: false})
    };
    openSideDrawerHandler = () => {
        this.setState({isDrawerOpen: true})
    };

    render (){
        return (
            <React.Fragment>
                <Toolbar openSideDrawer={this.openSideDrawerHandler}/>
                <SideDrawer show={this.state.isDrawerOpen}
                            closeDrawer={this.closeSideDrawerHandler}/>
                <main className={classes.Content}>
                    <Switch>
                        <Route path="/map" exact component={Map}/>
                        <Route path="/account" component={Account}/>
                        <Redirect exact from="/" to="/map" />
                    </Switch>
                </main>
            </React.Fragment>
        )
    }
}

export default Layout;
