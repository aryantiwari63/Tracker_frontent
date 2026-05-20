/* eslint-disable */
import React from 'react';

const Buttons = ({ name, labbtn }) => {
	return (
		<>
			<div>
				<button className="bg-blue-700 rounded-xl text-sm p-2">{name}</button>
				<button className="bg-gray-600 rounded-xl text-sm p-2">{labbtn}</button>
			</div>
		</>
	);
};

export default Buttons;
