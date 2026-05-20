/* eslint-disable */
import React, { useEffect, useState } from 'react';
import campdataams from '../../../data/Amazon/campdataams.json';
import AmazonAdvertiseTable from '../../common-components/Table.js/AmazonAdvertiseTable';
import customoption from '../../../data/Amazon/campaignManager/customcolumnAms';

const AmsCampTable = ({ data }) => {
	const [tableData, setTableData] = useState({
		header: [],
		body: [],
		footer: [],
	});

	useEffect(() => {
		setTableData({
			header: campdataams.header,
			body: campdataams.body,
			footer: campdataams.footer,
		});
	}, []);

	return (
		<>
			<AmazonAdvertiseTable
				headers={tableData.header}
				bodyContent={tableData.body}
				footer={tableData.footer}
				isCheckBoxRequired={true}
				loading={false}
			/>
		</>
	);
};

export default AmsCampTable;
