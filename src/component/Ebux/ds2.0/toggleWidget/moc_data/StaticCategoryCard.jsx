import React from 'react'

const StaticCategoryCard = () => {
  return (
    <div className='pb-[3px] px-[8px] rounded bg-white border border-gray-200'>
        <div className="flex -mx-2 flex-wrap items-center m-0 p-0">
            <div className='w-[15%] flex-[0_0_auto] px-[5px] -mt-1'>
                <label htmlFor="" className="text-[4px] font-medium leading-[1]">Brand</label>
                <div className="border rounded px-[3px] h-[15px] flex gap-2 items-center">
                    <div className='text-[4px] leading-[1]'>All i... </div>
                    <div className="bg-[#f5f8fa] text-[2px] font-normal rounded-2xl px-[4px] py-[2px]">+86 more</div>
                </div>
            </div>
            <div className='w-[15%] flex-[0_0_auto] px-[5px] -mt-1'>
                <label htmlFor="" className="text-[4px] font-medium leading-[1]">Category</label>
                <div className="border rounded px-[3px] h-[15px] flex gap-2 items-center">
                    <span className='text-[4px]'>Addit... </span>
                    <span className="bg-[#f5f8fa] text-[2px] font-normal rounded-2xl px-[4px] py-[2px]">+86 more</span>
                </div>
            </div>
            <div className='w-[15%] flex-[0_0_auto] px-[5px] -mt-1'>
                <label htmlFor="" className="text-[4px] font-medium leading-[1]">Location</label>
                <div className="border rounded px-[3px] h-[15px] flex gap-2 items-center">
                    <span className='text-[4px]'>28200... </span>
                    <span className="bg-[#f5f8fa] text-[2px] font-normal rounded-2xl px-[4px] py-[2px]">+86 more</span>
                </div>
            </div>
            <div className='w-[15%] flex-[0_0_auto] px-[5px] -mt-1'>
                <label htmlFor="" className="text-[4px] font-medium leading-[1]">Mother Pack</label>
                <div className="border rounded px-[3px] h-[15px] flex gap-2 items-center">
                    <span className='text-[4px]'>Select Product</span>
                </div>
            </div>
             <div className='w-[15%] flex-[0_0_auto] px-[5px] -mt-1'>
                <label htmlFor="" className="text-[4px] font-medium leading-[1]">Product</label>
                <div className="border rounded px-[3px] h-[15px] flex gap-2 items-center">
                    <span className='text-[4px]'>Puri... </span>
                    <span className="bg-[#f5f8fa] text-[2px] font-normal rounded-2xl px-[4px] py-[2px]">+86 more</span>
                </div>
            </div>
            <div className='w-[15%] flex-[0_0_auto] px-[5px] -mt-1'>
                <label htmlFor="" className="text-[4px] font-medium leading-[1]">OSA Status</label>
                <div className="border rounded px-[3px] h-[15px] flex gap-2 items-center">
                    <span className='text-[4px]'>Out o... </span>
                    <span className="bg-[#f5f8fa] text-[2px] font-normal rounded-2xl px-[4px] py-[2px]">+86 more</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default StaticCategoryCard
