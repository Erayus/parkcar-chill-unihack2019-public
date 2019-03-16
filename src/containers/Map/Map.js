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
import MapComponent from "../../components/MapComponent/MapComponent"
import classes from './Map.module.css'

import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import navigationItems from "../../components/Navigation/NavigationItems/NavigationItems";

const refs = {};
const _ = require("lodash");


class MapContainer extends Component {
    state = {
        currentLocation: null,
        mapCenterLoc: null,
        parkingSlots: [],
        singleSlotDetail: null,
        showSearchResult: null,
        directions: null,
        watchId: null,
        zoomLevel: 15,
        bounds: null,
        markers: []
    };

    markerClickHandler = (id) =>{
        let selectedSlot = this.state.parkingSlots.filter((slot) => {
           return slot.st_marker_id === id
        })[0];

        this.setState({singleSlotDetail: selectedSlot})
    };

    showDirection = (selectedSlot) => {
        const destination = {
            lat: selectedSlot.lat,
            lng: selectedSlot.lon
        };
        const DirectionsService = new google.maps.DirectionsService();

        //If watchId exists
        if (this.state.watchId){
            navigator.geolocation.clearWatch(this.state.watchId);
        }

        this.state.watchId = navigator.geolocation.watchPosition((position) => {

            let currentUserLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            if (this.distanceDifference(currentUserLocation, destination) < 0.01 ) {
                alert('You have arrived!')
            } else {
                DirectionsService.route({
                    origin: new google.maps.LatLng(this.state.currentLocation.lat, this.state.currentLocation.lng),
                    destination: new google.maps.LatLng(destination.lat, destination.lng),
                    travelMode: google.maps.TravelMode.DRIVING,
                }, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        this.setState({
                            directions: result,
                            zoomLevel: 18
                        });
                        this.onCloseSingleSlotDetail();

                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                });
            }
        });
    };



    distanceDifference = (current, destination) =>  {
        var earthRadiusKm = 6371;

        let currentLat = this.degreesToRadians(current.lat);
        let desLat = this.degreesToRadians(destination.lat);

        let dLat = this.degreesToRadians(destination.lat- current.lat);
        let dLon = this.degreesToRadians(destination.lng- current.lng);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(currentLat) * Math.cos(desLat);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return earthRadiusKm * c;
    };

    degreesToRadians = (degrees) => {
        return degrees * Math.PI / 180;
    };

    onCloseSingleSlotDetail = () => {
        this.setState({singleSlotDetail: null});
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
    onCenterChangedHandler = () => {
        this.setState({mapCenterLoc: refs.map.getCenter()})
    };
    onRecenterHandler = () => {
        this.setState({mapCenterLoc:  this.state.currentLocation })
    };

    onGoToClosestSlotHandler = () =>{
        const sortedBasedOnDistance = this.state.parkingSlots.map(slot => {
            let currentLocation = this.state.currentLocation;
            let destination= {
                lat: slot.lat,
                lng: slot.lon
            };
            return {
                ...slot,
                distanceDif: this.distanceDifference(currentLocation, destination)
            }
        }).sort( (a,b) => {
           return a.distanceDif - b.distanceDif
        });
        const closestSlot = sortedBasedOnDistance[0];

        this.showDirection(closestSlot)

    };

    onCancelDirectionHandler = ()=>{
      this.setState({directions: null})
    };

    onMapMountedHandler = (ref) => {
        refs.map = ref;
    };
    onSearchBoxMounted =  (ref) => {
        console.log('Search box', ref);
        refs.searchBox = ref;
    };
    onBoundsChanged =  () => {
        this.setState({
            bounds: refs.map.getBounds(),
            mapCenterLoc: refs.map.getCenter(),
        })
    };
    onPlacesChanged =  () => {
        const places = refs.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();

        places.forEach(place => {
            if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport)
            } else {
                bounds.extend(place.geometry.location)
            }
             });
        const nextMarkers = places.map(place => ({
            position: place.geometry.location,
        }));

        const nextCenter = _.get(nextMarkers, '0.position', this.state.mapCenterLoc);

        this.setState({
            mapCenterLoc: nextCenter,
            markers: nextMarkers,
        });

    };

    getUserCurrentLocation = () => {
            return new Promise ( (resolve, reject) => {
                if (navigator.geolocation) {
                    this.state.watchId = navigator.geolocation.watchPosition((position) => {
                        let result = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve(result)
                    })
                }else {
                    reject('Sorry we need your location')
                }
            })
    };
    componentWillMount() {
        this.getUserCurrentLocation()
            .then(res =>
                this.setState({currentLocation: res, mapCenterLoc: res})
            )
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
                    <MapComponent
                        userCurrentLoc={this.state.currentLocation}
                        mapCenterLoc={this.state.mapCenterLoc}
                        zoomLevel={this.state.zoomLevel}
                        parkingSlots={this.state.parkingSlots}
                        onSlotSelected={this.markerClickHandler}
                        directions={this.state.directions}
                        onCenterChanged={this.onCenterChangedHandler}
                        onGoToClosestSlot={this.onGoToClosestSlotHandler}
                        onCancelDirection={this.onCancelDirectionHandler}
                        onRecentered={this.onRecenterHandler}
                        onMapMounted={this.onMapMountedHandler}
                        onSearchBoxMounted={this.onSearchBoxMounted}
                        onPlacesChanged={this.onPlacesChanged}
                        onBounceChanged={this.onBoundsChanged}
                        markers={this.state.markers}
                        bounds={this.state.bounds}
                    /> : null }

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
                // console.log(filterData);
                this.setState({parkingSlots: [...filterData]})
            })
    }

}

export default MapContainer;
