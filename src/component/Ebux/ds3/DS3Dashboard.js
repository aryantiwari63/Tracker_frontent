import React, { useRef } from 'react';
import { useEbuxContext } from '../Context/EbuxProvider';
import DS3KPICards from './DS3KPICards';
import DS3PlatformCarousel from './DS3PlatformCarousel';
import { EbuxTableProvider } from '../Context/EbuxTableProvider';
import OSA from '../OSA';
import SOS from '../SOS';
import OrganicRanking from '../OrganicRanking';
import ContentScore from '../ContentScore';
import Promotions from '../Promotions';
import RatingReviewsnew from '../RatingReviewsnew';
import RatingReviews from '../RatingReviews';
import SOM from '../SOM';
import ShareDisplay from '../ShareDisplay';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DS3Dashboard = ({ mainKpi, averagePercentageData, isDarkStore, forceDS3 }) => {
    const { kpi, activeClientProject, filtersLoading } = useEbuxContext();
    const contentRef = useRef(null);

    const KPI_COMPONENTS = {
        OSA: <OSA type={2} />,
        SOS: <SOS type={2} />,
        OR: <OrganicRanking type={2} />,
        CS: <ContentScore type={2} />,
        PRO: <Promotions type={2} />,
        RR: ([2, 101, 103, 102].includes(activeClientProject?.client_project_id) || activeClientProject?.useNewRRView)
            ? <RatingReviewsnew type={2} />
            : <RatingReviews type={2} />,
        SOM: <SOM type={2} />,
        SOD: <ShareDisplay type={2} />,
    };

    if (filtersLoading) return null;

    const scroll = (direction) => {
        if (contentRef.current) {
            const scrollAmount = 300;
            contentRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };
    return (
        <div className="bg-[#F8FAFC]">
            <div className="bg-[#F0F2F5] ">
                {/* border border-[#E2E8F0] */}

                {/* <h2 className="text-[20px] font-semibold mb-4 text-[#000000E0]">
                    Digital Shelf Parameters
                </h2> */}

                <EbuxTableProvider>
                    <div className="relative">

                        {/* KPI Cards */}
                        <div className='bg-white px-4 pt-4 shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008] rounded-t-[16px]'>
                            <h2 className="text-[20px] font-semibold mb-4 text-[#000000E0]">
                                Digital Shelf Parameters
                            </h2>
                            <div className="relative z-20 -mb-[2px]">
                                <DS3KPICards mainKpi={mainKpi} averagePercentageData={averagePercentageData} />
                            </div>
                        </div>
                        {/* Platform + Details */}
                        <div className="relative z-10 w-full group">
                            <button onClick={() => scroll('left')} className="absolute left-2 -translate-y-1/2 z-20 w-8 h-8 rounded-full shadow-md flex items-center justify-center border border-gray-100
                            bg-black/50 text-white absolute left-[0%] top-[48%]">
                                <img src="/assets/images/chevron-left2.png" className="w-4 h-4" alt="Left" />
                            </button>

                            {/* <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full  bg-[#666666] shadow-md flex items-center justify-center transition-all  border border-gray-100">
                                   
<FontAwesomeIcon icon={faChevronLeft} className="text-white w-3 h-3" />
            </button> */}
                            <DS3PlatformCarousel externalRef={contentRef} isDarkStore={isDarkStore} forceDS3={forceDS3} type={"osa_plateform"} />                            <button onClick={() => scroll('right')} className="absolute right-2 -translate-y-1/2 z-20 w-8 h-8 rounded-full shadow-md flex items-center justify-center border border-gray-100
                            bg-black/50 text-white absolute right-[0%] top-[48%]">
                                <img src="/assets/images/chevron-right2.png" className="w-4 h-4" alt="Right" />
                            </button>
                            {/* <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full  bg-[#666666] shadow-md flex items-center justify-center transition-all  border border-gray-100">
                <FontAwesomeIcon icon={faChevronRight} className="text-white w-3 h-3" />
            </button> */}


                        </div>
                        <div className="">
                            {KPI_COMPONENTS[kpi]}
                        </div>

                    </div>
                </EbuxTableProvider>
            </div>
        </div>
    );
};

export default DS3Dashboard;