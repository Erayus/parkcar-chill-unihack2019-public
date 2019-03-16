import React, {Component} from 'react'
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component{

    //Only update when this 'show' property is different than the last show property (only update when the modal is open or close)
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.show !== nextProps.show || this.props !== nextProps ;
    }


    render() {
        return (
            <React.Fragment>
                <div className={classes.Modal}
                     style={{
                         transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                         opacity: this.props.show ? '1' : '0'
                     }}
                >
                    {this.props.children}
                </div>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
            </React.Fragment>
        )
    }

}

export default Modal;
