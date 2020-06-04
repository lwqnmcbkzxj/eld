import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';



const Loader = () => {
	return (
		<div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></div>					
	);
}
export default Loader