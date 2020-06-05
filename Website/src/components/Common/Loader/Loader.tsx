import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';



const Loader = ({ style = {}, ...props }: any) => {
	return (
		<div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}><CircularProgress /></div>					
	);
}
export default Loader