import React, {Component} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import classes from "./Map.module.css";
import userIcon from "../../assests/Map-Icon/Button icon/driver icon.png";
import slotIcon1P from "../../assests/Map-Icon/Unoccupied/Free 1P.png"
import slotIcon2P from "../../assests/Map-Icon/Unoccupied/Free 2p.png"
import slotIcon4P from "../../assests/Map-Icon/Unoccupied/4p Free.png"
import slotIcon9P from "../../assests/Map-Icon/Unoccupied/Free9p.png"
/*global google*/

import axios from '../../axios';
import Modal from "../../components/UI/Modal/Modal";
class MapContainer extends Component {
    state = {
        currentLocation: null,
        parkingSlots: [],
        singleSlotDetail: null,
        showSearchResult: null
    };

    markerClickHandler = (props, marker, e) =>{
        console.log('Maker', marker);
        let selectedSlot = {
            type: '',
            paid: false,
            id: marker
        };
        this.setState({singleSlotDetail: selectedSlot})
    };

    onCloseSingleSlotDetail = () => {
        console.log('clicked');
        this.setState({singleSlotDetail: null})
    };

    generateIcon(type){
        switch (type) {
            case "1P":
                return slotIcon1P;
            case "2P":
                return slotIcon2P;
            case "4P":
                return slotIcon4P;
            case "9P":
                return slotIcon9P
        }
    }

    componentWillMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                let currentLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.setState({currentLocation: currentLoc})
            });
        }
    }


    render(){
        let map = null;
        if (this.state.currentLocation){
            map = (
                <Map google={this.props.google}
                 zoom={14}
                 initialCenter={{
                     lat: this.state.currentLocation.lat,
                     lng: this.state.currentLocation.lng
                 }}
                >
                    <Marker
                        title={"User"}
                        icon={{
                            url: userIcon,
                            scaledSize: new google.maps.Size(50,50)
                        }}
                        name={'SOMA'}
                    />
                    {this.state.parkingSlots.length > 0 ? this.state.parkingSlots.map(slot => {
                        return (
                            <Marker
                                key={slot.st_marker_id}
                                position={{
                                    lat: slot.lat,
                                    lng: slot.lon
                                }}
                                icon={{
                                    url: slotIcon1P,
                                    scaledSize: new google.maps.Size(30,30)
                                }}
                                data={{
                                    id: slot.st_marker_id
                                }}
                                onClick={this.markerClickHandler}
                                title={"Available parking slot"}
                            />
                        )
                    })
                        : null
                    }

                </Map>
            )
        }
        return (
            <div>
                { this.state.currentLocation ? map : null }
                <Modal
                    show={this.state.singleSlotDetail}
                    modalClosed={this.onCloseSingleSlotDetail}
                ></Modal>
            </div>

        )
    }
    componentDidMount() {
        axios.get('/')
            .then(res => {
                let filterData = res.data.slice(0,10);
                console.log(filterData);
                this.setState({parkingSlots: [...filterData]})
            })
    }

}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyBQHtyAJNwYpl47skW7ySxFtuF6VCGm51A")
})(MapContainer)
