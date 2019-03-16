import React from 'react';
import classes from "./Toolbar.module.css";
import Logo from "../../../assests/Logo/ParkCarChill_Black.PNG";
import NavigationItems from "../NavigationItems/NavigationItems";


const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <button className={classes["Toggle-Btn"]} onClick={props.openSideDrawer}>
                <i className="fas fa-bars"></i>
            </button>
            <div className={classes.Logo}>
                <img src={Logo} height='50px'/>
            </div>
        </header>
    )
};

export default toolbar;
