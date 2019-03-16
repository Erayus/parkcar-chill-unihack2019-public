import React, {Component} from 'react';
// import {Map, InfoWindow, Marker, GoogleApiWrapper, DirectionService} from 'google-maps-react';
import userIcon from "../../assests/Map-Icon/Button icon/driver icon.png";
import slotIcon1P from "../../assests/Map-Icon/Unoccupied/Free 1P.png";
import slotIcon2P from "../../assests/Map-Icon/Unoccupied/Free 2p.png";
import slotIcon4P from "../../assests/Map-Icon/Unoccupied/4p Free.png";
import slotIcon9P from "../../assests/Map-Icon/Unoccupied/Free9p.png";
/*global google*/
import axios from '../../axios';
import Modal from "../../components/UI/Modal/Modal";
import classes from './Map.module.css'

import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";


class MapContainer extends Component {
    state = {
        currentLocation: null,
        parkingSlots: [],
        singleSlotDetail: null,
        showSearchResult: null,
        directions: null
    };

    markerClickHandler = (id) =>{
        let selectedSlot = this.state.parkingSlots.filter((slot) => {
           return slot.st_marker_id === id
        })[0];

        this.setState({singleSlotDetail: selectedSlot})
    };

    showDirection(selectedSlot){
        let destination = {
            lat: selectedSlot.lat,
            lng: selectedSlot.lon
        };

        const DirectionsService = new google.maps.DirectionsService();

        DirectionsService.route({
            origin: new google.maps.LatLng(this.state.currentLocation.lat, this.state.currentLocation.lng),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                console.log(result);
                this.onCloseSingleSlotDetail();
                this.setState({
                    directions: result,
                });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }

    onCloseSingleSlotDetail = () => {
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


    render() {
        let slotDetail = null;
        if (this.state.singleSlotDetail){
            slotDetail = (
                <div>
                    <h1>{this.state.singleSlotDetail.st_marker_id}</h1>
                    <button className="btn btn-success"
                            onClick={() => this.showDirection(this.state.singleSlotDetail)}>Start</button>
                </div>
            )
        }
        return (

            <div>
                { this.state.currentLocation ?
                    <MyMapComponent
                        currentLoc={this.state.currentLocation}
                        parkingSlots={this.state.parkingSlots}
                        onSlotSelected={this.markerClickHandler}
                        directions={this.state.directions}
                    />
                        : null }

                <Modal
                show={this.state.singleSlotDetail}
                modalClosed={this.onCloseSingleSlotDetail}
                >
                    {slotDetail}
                </Modal>
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

const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBQHtyAJNwYpl47skW7ySxFtuF6VCGm51A&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) => {


    let handleMarkerClick = (id) => {
        props.onSlotSelected(id)
    };

        return (

            <GoogleMap
                defaultZoom={15}
                defaultCenter={{lat: props.currentLoc.lat, lng: props.currentLoc.lng}}
            >
                <Marker position={{lat: props.currentLoc.lat, lng: props.currentLoc.lng}}/>

                {/*Generate parking slot markers*/}
                {props.parkingSlots.length > 0 ? props.parkingSlots.map(slot => {
                        return (
                            <Marker
                                key={slot.st_marker_id}
                                position={{
                                    lat: +slot.lat,
                                    lng: +slot.lon
                                }}
                                icon={{
                                    url: slotIcon1P,
                                    scaledSize: new google.maps.Size(30,30)
                                }}
                                data={{
                                    id: slot.st_marker_id
                                }}
                                onClick={() => handleMarkerClick(slot.st_marker_id)}
                                title={"Available parking slot"}
                            />
                        )
                    })
                    : null
                }

                {props.directions && <DirectionsRenderer options={{suppressMarkers: true}} directions={props.directions} />}
            </GoogleMap>
        );
    }

);


export default MapContainer;
