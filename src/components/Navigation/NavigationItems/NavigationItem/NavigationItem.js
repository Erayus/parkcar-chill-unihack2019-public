import React from "react";
import classes from "./NavigationItem.module.css";
import { Link, NavLink } from "react-router-dom";
const navigationItem = (props) =>{
    return (
        <li className={classes.NavigationItem}>
            <NavLink to={props.link} exact className={props.active ? classes.active : null}>{props.children}</NavLink>
        </li>
    )
};

export default navigationItem
