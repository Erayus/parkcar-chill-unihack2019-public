import React from "react";
import NavigationItem from "./NavigationItem/NavigationItem"
import classes from "./NavigationItems.module.css"

const navigationItems = (props)=> {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" active>Home</NavigationItem>
            <NavigationItem link="/">
                <span>Balance </span>
                <span>$35</span>
            </NavigationItem>
            <NavigationItem link="/">Account</NavigationItem>
            <NavigationItem link="/">Privacy</NavigationItem>
            <NavigationItem link="/">Settings</NavigationItem>
        </ul>
    )
};

export default navigationItems;
