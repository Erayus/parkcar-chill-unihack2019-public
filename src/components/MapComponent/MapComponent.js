import React from 'react'
import slotIcon1P from "../../assests/Map-Icon/Unoccupied/Free 1P.png";
import { compose, withProps, withHandlers} from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import UserIcon from "../../assests/Map-Icon/Button icon/Driver-icon.jpg";
/*global google*/
import classes from './MapComponent.module.css'
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");


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

    if (props.markers[0]){
        console.log('Markers:fdaad ', props.markers[0]);
    }
        let handleMarkerClick = (id) => {
            props.onSlotSelected(id)
        };

        return (
            <GoogleMap
                ref={props.onMapMounted}
                zoom={+props.zoomLevel}
                center={props.mapCenterLoc}
                defaultOptions={{
                    zoomControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                    mapTypeControl: false
                }}
                onCenterChanged={props.onCenterChanged}
            >
                <Marker
                    position={{lat: props.userCurrentLoc.lat, lng: props.userCurrentLoc.lng}}
                    icon={{
                        url: UserIcon,
                        scaledSize: new google.maps.Size(50,50)
                    }}
                />
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
                {props.directions ?
                    (
                    <div>
                        <DirectionsRenderer options={{suppressMarkers: true, preserveViewport: true}} directions={props.directions} />
                        <button className={classes.CancelDirectionBtn} onClick={props.onCancelDirection}>
                            <i className="fas fa-ban"></i>
                        </button>
                        <div className={classes.DirectionDetails}>
                            <h4><strong>Trip Details</strong></h4>
                            {props.directions.routes[0].legs[0].duration.text}
                        </div>
                    </div>
                    )
                    : null
                }
                <SearchBox
                    ref={props.onSearchBoxMounted}
                    bounds={props.bounds}
                    controlPosition={google.maps.ControlPosition.TOP_LEFT}
                    onPlacesChanged={props.onPlacesChanged}
                >
                    <input
                        type="text"
                        placeholder="Where are you planning to go to? "
                        className={classes.SearchBox}
                    />

                </SearchBox>
                {props.markers.map((marker, index) =>
                    <Marker key={index} position={marker.position} />
                )}

                <button className={classes.ClosestButton} onClick={props.onGoToClosestSlot} >
                    <i className="fas fa-shipping-fast"></i>
                </button>

                <button className={classes.RecenterButton} onClick={props.onRecentered} >
                    <i className="fas fa-map-marker-alt"></i>
                </button>
            </GoogleMap>
        );
    }

);

export default MyMapComponent;
