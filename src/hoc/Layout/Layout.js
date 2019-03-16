import React, {Component} from "react";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import classes from './Layout.module.css';
import Main from '../../containers/Map/Map';


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
                    <Main/>
                </main>
            </React.Fragment>
        )
    }
}

export default Layout;
