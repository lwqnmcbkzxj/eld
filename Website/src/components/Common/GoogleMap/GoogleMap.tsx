import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
const AnyReactComponent = ({ text }: any) => <div>{text}</div>;
 
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };
 
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '420px', width: '100%' }}>
        <GoogleMapReact
        //   bootstrapURLKeys={{
		// 	key:'AIzaSyCOMoJWnlfAlQDgKUI0qMHHdpEoixv40Z4',			
		// }}
          defaultCenter={{ lat: 39.7, lng: -101.3 }}
          defaultZoom={6}
        >
         
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default SimpleMap;