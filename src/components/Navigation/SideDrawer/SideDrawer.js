import React from "react";
import NavigationItems from "../NavigationItems/NavigationItems";
import classes from "./SideDrawer.module.css"
import Backdrop from "../../UI/Backdrop/Backdrop";
import LogoURL from "../../../assests/Logo/ParkCarChill_Black.PNG";


const sideDrawer = (props) => {
    return (
        <React.Fragment>
            <div className={[classes.SideDrawer, props.show ? classes.Open : classes.Close].join(' ')}>
                <div className={classes.Logo}>
                    <img src={LogoURL} height="50px"/>
                </div>
                <nav>
                    <NavigationItems/>
                </nav>
            </div>
            <Backdrop show={props.show} clicked={props.closeDrawer}/>
        </React.Fragment>
    )
};

export default sideDrawer;
