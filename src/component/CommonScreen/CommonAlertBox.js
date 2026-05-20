import React from "react";

const CommonAlertBox = ({
    platformName,
    campaignType,
    posImp,
    posSpend,
    posCtr,
    posCpc,
    posRoas,
    negImp,
    negSpend,
    negCtr,
    negCpc,
    negRoas,
    negCampaigns,
    posCampaigns,
    negCpm,
    posCpm
}) => {
    return (
        <div className="bg-white mt-4 mb-4 w-full h-fit">
            <div className="p-4">
                {campaignType !== "Budget" ? (
                    <div className=" ">
                        <div className="h-7 font-semibold"> {platformName && platformName} </div>

                        <div className="border mr-1 rounded p-2 w-full">
                            <div className="flex items-center">

                                <img
                                    src="/assets/images/globe.png"
                                    alt="loader"
                                    className="h-1/2 mr-2"
                                />
                                <div className="font-semibold text-lg">{campaignType}</div>
                            </div>


                            <div className="pt-3 pb-2">
                                <span className="text-red-500 mr-1 font-semibold">-</span>
                                <span>Negative Trends</span>
                                <ul>
                                    <li className="flex">
                                        Drop in Impressions:{" "}
                                        {negImp !== null ? Math.abs(negImp?.toFixed(2)) : 0}%
                                        <img
                                            src="/assets/images/negArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Drop in Spends:{" "}
                                        {negSpend !== null ? Math.abs(negSpend?.toFixed(2)) : 0}%
                                        <img
                                            src="/assets/images/negArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Drop in CTR: {negCtr !== null ? Math.abs(negCtr?.toFixed(2)) : 0}%
                                        <img
                                            src="/assets/images/negArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Drop in CPC: {negCpc !== null ? Math.abs(negCpc?.toFixed(2)) : 0}%
                                        <img
                                            src="/assets/images/negArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Drop in ROAS: {negRoas !== null ? Math.abs(negRoas?.toFixed(2)) : 0}%
                                        <img
                                            src="/assets/images/negArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Drop in CPM: {negCpm !== null ? Math.abs(negCpm?.toFixed(2)) : 0}%
                                        <img
                                            src="/assets/images/negArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                </ul>
                                <div className="border-gray-400 rounded bg-gray-200 mt-2 py-1 px-2 text-sm w-fit cursor-pointer">
                                    Review {negCampaigns} campaigns
                                </div>
                            </div>
                            <div className="pt-3 pb-2">
                                <span className="text-green-700 mr-1 font-semibold">+</span>
                                <span>Positive Trends</span>
                                <ul>
                                    <li className="flex">
                                        Rise in Impressions:{" "}
                                        {posImp !== null ? posImp?.toFixed(2) : 0}%
                                        <img
                                            src="/assets/images/posArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Rise in Spends:{" "}
                                        {posSpend !== null ? posSpend?.toFixed(2) : 0}%
                                        <img
                                            src="/assets/images/posArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Rise in CTR: {posCtr !== null ? posCtr?.toFixed(2) : 0}%
                                        <img
                                            src="/assets/images/posArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Rise in CPC: {posCpc !== null ? posCpc?.toFixed(2) : 0}%
                                        <img
                                            src="/assets/images/posArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                    <li className="flex">
                                        Rise in ROAS: {posRoas !== null ? posRoas?.toFixed(2) : 0}%
                                        <img
                                            src="/assets/images/posArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>

                                    <li className="flex">
                                        Rise in CPM: {posCpm !== null ? posCpm?.toFixed(2) : 0}%
                                        <img
                                            src="/assets/images/posArrow.png"
                                            alt="loader"
                                            className="h-1/2 m-2"
                                        />
                                    </li>
                                </ul>
                                <div className="border-gray-400 rounded bg-gray-200 mt-2 py-1 px-2 text-sm w-fit cursor-pointer">
                                    Review {posCampaigns} campaigns
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="h-7"></div>
                        <div className=" h-[472px]">
                            <div className="border mr-1 rounded p-2 w-full h-full">
                                <div className="flex items-center">

                                    <img
                                        src="/assets/images/globe.png"
                                        alt="loader"
                                        className="h-1/2 mr-2"
                                    />
                                    <div className="font-semibold text-lg">{campaignType}</div>
                                </div>
                                You have 75 Sponsored Products Campaigns that are out of
                                budget, with an estimated 92.23k- 282.73k missed clicks
                                and 7.92M- 23.78M missed impressions.
                                <div className="border-gray-400 rounded bg-gray-200 mt-2 py-1 px-2 text-sm w-fit cursor-pointer">
                                    Review {posCampaigns} campaigns
                                </div>

                            </div>
                        </div></>

                )}
                <></>
            </div>
        </div>
    );
};

export default CommonAlertBox;
