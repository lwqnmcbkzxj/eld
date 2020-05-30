import React, { FC, Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }: any) => <div>{text}</div>;


type GoogleMapProps = {
	fullHeight?: boolean
	height?: number
}
const SimpleMap: FC<GoogleMapProps> = ({ fullHeight = false,...props }) => {
	let height = '420px'
	if (fullHeight)
		height = 'calc(100vh - 56px - 66px)'

	return (
		// Important! Always set the container height explicitly
		<div style={{ height: height, width: '100%' }}>
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

export default SimpleMap;