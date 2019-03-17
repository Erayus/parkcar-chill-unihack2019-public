import React from "react";
import NavigationItem from "./NavigationItem/NavigationItem"
import classes from "./NavigationItems.module.css"

const navigationItems = (props)=> {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" active>Home</NavigationItem>
            <NavigationItem link="/account">
                <span>Account </span>
                <span>($35)</span>
            </NavigationItem>
            <NavigationItem link="/">Disabled</NavigationItem>
            <NavigationItem link="/">Privacy</NavigationItem>
            <NavigationItem link="/">Setting</NavigationItem>
        </ul>
    )
};

export default navigationItems;
