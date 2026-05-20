import React, { useState } from 'react';
import AmazonNegativeKeyword from './AmazonNegativeKeyword';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Negative Keyword');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const tabItems = ['Negative Keyword', 'Negative Product'];

  return (
    <div className="w-full p-4">
      <div className="flex px-3 py-3 bg-white">
        {tabItems.map((tabName) => (
          <div
            key={tabName}
            className={`cursor-pointer text-base font-medium px-0.5  ${
              activeTab === tabName ? 'text-[#1890FF] border-b-2 border-[#1890FF]' : 'text-black'
            }`}
            onClick={() => handleTabClick(tabName)}
            style={{ marginRight: '10px' }}  
          >
            {tabName}
          </div>
        ))}
      </div>
      <div className="pt-4">
        {/* Content for the active tab */}
        {activeTab === 'Negative Keyword' && (
          <div className="">
            <AmazonNegativeKeyword/>
          </div>
        )}
        {activeTab === 'Negative Product' && (
          <div className=""></div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
