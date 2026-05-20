import { useEffect, useRef, useState } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "./StickyTable.css"
import { fetchSameDatePlatformPlacementBannersData } from "../../../../services/sod_banner_drawer.service";

const BannerDrawer = ({ onClose, drawerInfo }) => {
    const {
        kpi,
        filters,selectedFilters
    } = useEbuxContext();
    const swiperRef = useRef(null); 
    const [tabs,setTabs] = useState("brands")
    const [activeSlide,setActiveSlide] = useState(0)
    // const [activeBanner,setActiveBanner] = useState()
    const [loading,setLoading] = useState(false)
    const [reportTableData,setReportTableData] = useState({})
    useEffect(() => {
            async function fetchData() {
                setLoading(true);
               
                    const currentData = await fetchSameDatePlatformPlacementBannersData(filters,selectedFilters,(drawerInfo?.banner_info?.label ?? drawerInfo?.banner_info?.lable ?? null),drawerInfo?.banner_info?.value,(drawerInfo?.banner_brand_type=='brand'?1:0));
                    // console.log(Object.keys(currentData)?.[0]);
                    const firstTab=Object.keys(currentData)?.[0];
                    setTabs(firstTab)
                    // setActiveBanner(currentData?.[firstTab]?.[0])
                    setReportTableData(currentData);
             
                setLoading(false);
            }
            fetchData();
        }, [drawerInfo]);
    const handleNext = () => {
        if (swiperRef?.current) {
            swiperRef?.current?.slideNext(); 
            const total=((Object.values(reportTableData?.[tabs]??{})?.length??0))
            setActiveSlide((a)=>(((a+1)>=total)?total-1:(a+1)))
            // Navigate to the next slide
            // swiperRef?.current?.swiper?.slideNext(); // Navigate to the next slide
        }
    };

    // Function to handle previous slide
    const handlePrev = () => {
        if (swiperRef?.current) {
            // swiperRef?.current?.swiper?.slidePrev(); // Navigate to the previous slide
            swiperRef?.current?.slidePrev(); // Navigate to the previous slide
            setActiveSlide((a)=>((a-1)>0?(a-1):0))

        }
    };

    const handleChangeTabs = (val)=>{
        setTabs(val)
    }


    return (
        <>
        {
            kpi=="SOD"?
            <div className="performanceDrawerBox lg:w-[1051px] md:w-full">
                <div className="performanceDrawerHead lg:h-[64px]">
                    <button type="button" className="closeButton" onClick={onClose}>
                        <img src="/assets/images/drawerClose.svg" width={11.31} height={11.31} />
                    </button>
                    <h6 className="ms-3 capitalize text-[16px] text-[500] leading-[24px]">View Banner</h6>
                </div>
                <div className="performanceDrawerContent">
                    {loading?<>Loading...</>:
                    <>
                    <div className="">
                        <div className="bg-white lg:w-[662px] md:w-[80%] mx-auto rounded-[15.02px] lg:h-[417px] p-[1.5rem]">
                        <Swiper

                        // ref={swiperRef}         
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                                    spaceBetween={50}
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    navigation={{
                                        prevEl: '.swiper-button-prev',  // Link to previous button
                                        nextEl: '.swiper-button-next',  // Link to next button
                                    }}
                                    className="h-full"
                                >
                                    {Object.values(reportTableData?.[tabs]??{})?.map((item,i)=>
                                     <SwiperSlide key={i}>
                                    <div className="w-full pb-[1rem]">
                                <div className="md:flex items-center justify-between">
                                    <div className="text-center mb-2">
                                        <p className="text-[12px] text-[600] leading-[22px] text-[#000000D9] mb-0">{item.banner_url?.split('/').pop()}</p>
                                        <p className="text-[10px] text-[500] leading-[22px] text-[#000000D9] m-0">{item.banner_id}</p>
                                    </div>
                                    <div className="flex items-start gap-[13px] md:justify-end justify-center">
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-[600] leading-[22px] text-[#000000D9] mb-0">Platform</p>
                                            <span className="text-[10px] text-[500] leading-[22px] text-[#000000D9]">{item.platform_name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-[600] leading-[22px] text-[#000000D9] mb-0">SOD%</p>
                                            <span className="text-[10px] text-[500] leading-[22px] text-[#000000D9]">{item.sod}%</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-[600] leading-[22px] text-[#000000D9] mb-0">Ad Rank</p>
                                            <span className="text-[10px] text-[500] leading-[22px] text-[#000000D9]">{item.ad_rank?.[0]??0}/10</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-[600] leading-[22px] text-[#000000D9] mb-0">Placement</p>
                                            <span className="text-[10px] text-[500] leading-[22px] text-[#000000D9]">{item.display_ad_type}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-[600] leading-[22px] text-[#000000D9] mb-0">Number of Banners</p>
                                            <span className="text-[10px] text-[500] leading-[22px] text-[#000000D9]">{item.number_of_banners}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='lg:w-[474px] lg:h-[300px] md:w-[70%] w-[100%] h-fit overflow-hidden relative mx-auto'>
                                
                                       
                                            <div className="lg:w-[300px] h-[300px] w-[70%] h-[70%] mx-auto" >
                                                <img src={item?.banner_url} className='w-full h-full' />
                                            </div>
                                        
                                    
                                
                            </div>
                            </SwiperSlide>
                        )}
                            </Swiper>
                                <button  onClick={handlePrev}  className="swiper-button-prev cursor-pointer z-10 bg-transparent absolute left-0 top-[45%] transform -translate-y-1/2 bg-gray-200 p-2 w-[62px] h-[62px]">
                                    <img src="/assets/images/angle-left.png" className='w-[19.36px] h-[26.62px]' />
                                </button>
                                <button onClick={handleNext} className="swiper-button-next flex justify-end items-center cursor-pointer z-10 bg-transparent absolute right-0 top-[45%] transform -translate-y-1/2 bg-gray-200 p-2 w-[62px] h-[62px]">
                                    <img src="/assets/images/angle-right.png" className='w-[19.36px] h-[26.62px]' />
                                </button>
                        </div>
                    </div>
                    <div className="mt-4 border border-[#E6E6E6] p-2 rounded-[4px] bg-[#FFFFFF]">
                        <div className="flex space-x-2">
                        {["Brand","Brand - Not Identified","Competition","Other"].filter(item => (Object.keys(reportTableData??{})??[])?.includes(item))?.map((item,i)=>
                            
                            <button key={i} onClick={()=>{if (tabs !== item) {handleChangeTabs(item); setActiveSlide(0); swiperRef?.current?.slideTo(0); }}}
                                className={`lg:px-4 lg:py-2 py-1 px-2 rounded-sm text-[14px] font-500 text-[#53545ED9] bg-[#FAFAFA] border-2 border-[#F0F0F0] tabs ${tabs == item ? "active" : ""}`}>{item}</button>
                        )}
                        </div>
                        
                        <div className={`${"block"} competition-content flex overflow-x-auto gap-[20px] border border-[#E6E6E6] rounded-[8px] p-[10px]`}>
                          
                
        {Object.values(reportTableData?.[tabs]??{})?.map((item,i)=>
                         
        
           <div key={i} className={`cursor-pointer w-[60px] h-[64px] flex-[0_0_auto] border ${((activeSlide == i)) ? 'border-[#0081F7]': 'border-[#E6E6E6]'} hover:border-[#0081F7] p-[6px_7px] rounded-[4px] `} onClick={()=>{swiperRef?.current?.slideTo(i); setActiveSlide(i)}}>
                                    <img src={item?.banner_url} className="w-[48px] h-[48px]" />
                                    
                            </div>
       
        )}
                            
                        </div>
                    </div>
                    </>
                    }

                    {/* <div className="performanceDrawerContentWrap !px-0 !py-0">
                        {reportTableData?.length > 0 && (<BreakDownTable drawerInfo={drawerInfo} reportTableData={reportTableData} breakdownPerformance={breakdownPerformance}/>)}
                    </div> */}
                </div>
            </div>
            :
            <></>
            }
        </>
    );
};

export default BannerDrawer;