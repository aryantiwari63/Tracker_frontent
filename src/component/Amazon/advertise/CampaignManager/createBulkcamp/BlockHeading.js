/* eslint-disable */
import React, { useState } from 'react';
import { AiFillQuestionCircle, AiOutlineExclamation } from 'react-icons/ai';
import CreateAdGroupSteps from './Products/CreateAdGroupSteps';

const BlockHeading = ({ heading, subheading, children, moreicon }) => {
	const [showTooltip, setShowTooltip] = useState(false);
	const [showHelp, setShowHelp] = useState(false);

	const toggleTooltip = () => {
		setShowTooltip(!showTooltip);
	};
	const toggleHelp = () => {
		setShowHelp(!showHelp);
	};
	return (
		<>
			<div className="row px-4  py-3 justify-between bg-white border-b">
				<div className="text-2xl py-2 inline-block">
					{moreicon}
					{heading} {children}
				</div>

				<div
					className=" text-sm text-blue-400 pt-4"
					onClick={toggleHelp}
					style={{ cursor: 'pointer' }}
				>
					<div className="row items-center ">
						<AiFillQuestionCircle />
						<button className="text-sm text-blue-400 pl-1">{subheading}</button>
					</div>
				</div>
			</div>
			{showHelp && (
				<div className="help-panel col_4">
					<CreateAdGroupSteps
						onClose={toggleHelp}
						content={
							" Ad groups are a way to organize, manage, and track performance of the products within your campaign. You can use ad groups to group your ads by brand, product, category, price range, or other classifications like theme or targeting strategy. Products placed together in an ad group share the same bids and targets (keywords or products). We recommend creating ad groups with products that are in the same category. This helps optimize your bidding strategy, relevancy, and targeting. The first ad group is created when you create a campaign. You can add more ad groups to the campaign after you've saved it."
						}
						tipcontent={
							'Give your ad group a name that is descriptive and meaningful to you,based on the products you want to advertise. For example, by category, like Barbecue grills.'
						}
					/>
				</div>
			)}
		</>
	);
};
export default BlockHeading;
