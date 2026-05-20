/* eslint-disable */
import React, { useEffect, useState } from 'react';
import campdataams from '../../../../data/Amazon/campdataams.json';
import AmazonTargetTable from '../../../common-components/Table.js/AmazonTargetTable';

const AmsTargetTable = () => {
	const [tableData, setTableData] = useState({
		header: [],
		body: [],
		footer: [],
	});

	useEffect(() => {
		setTableData({
			header: campdataams.targetheader,
			body: campdataams.targetbody,
			footer: campdataams.footer,
		});
	}, []);

	return (
		<>
			<AmazonTargetTable
				headers={tableData.header}
				bodyContent={tableData.body}
				footer={tableData.footer}
				isCheckBoxRequired={true}
				loading={false}
			/>
		</>
	);
};

export default AmsTargetTable;
