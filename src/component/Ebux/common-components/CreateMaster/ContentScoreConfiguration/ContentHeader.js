export default function ContentHeader({ activeStep }) {
    return (
        <div className="mb-[10px] bg-white shadow-md px-4 py-4 rounded-lg">
            <div className="flex items-center justify-between border border-[#dcdcdc] px-[16px] pt-[30px] pb-[44px] rounded relative">
                <div className="absolute left-12 top-[80px] w-[200px]">
                    <div className="font-inter font-semibold text-[14px] leading-[22px] tracking-[3%] text-[#1890FF]">Content Score</div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center w-[90%] left-[4%] relative">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center text-blue-500">
                                <img src="/assets/images/master/circle-percent.svg" alt="Step 1" className="w-[16px] h-[16px]" />
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-gray-200 rounded overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500" style={{ width: '0%' }} />
                        </div>

                        <div className="relative">
                            <div className={`w-10 h-10 rounded-full border  flex items-center justify-center ${activeStep == 'preview' ? "text-[#1890FF] border-blue-400 text-blue-500" : "text-gray-500 border-gray-300"}`}>
                                {
                                    activeStep == 'preview' ?
                                        <img src="/assets/images/master/eye-active.svg" alt="Step 1" className="w-[16px] h-[16px]" />
                                        :
                                        <img src="/assets/images/master/eye.svg" alt="Step 1" className="w-[16px] h-[16px]" />
                                }
                            </div>
                        </div>

                    </div>
                </div>
                <div className="absolute top-[80px] right-[2%] w-[200px]">
                    <div className={`font-inter font-semibold text-[14px] leading-[22px] tracking-[3%]  ${activeStep == 'preview' ? "text-[#1890FF]" : "text-gray-500"} flex justify-center`}>Preview</div>
                </div>
            </div>
        </div>
    );
}
