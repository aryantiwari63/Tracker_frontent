/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import TagManagerTable from "./TagManagerTable";
import TagManage from "./TagManagerProvider";
import SearchField from "./SearchField";
import CreateTagPopup from "./CreateTagPopup";
import { _POST, _GET } from "../../../services/axios.method";
import { AMAZON_ACCOUNTS } from "../../../utils/amazonConstants";
import _ from "lodash";
import {
  GET_COMMON_ACCOUNTS,
  GET_ACCOUNTS,
  GET_ZEPTO_ACCOUNTS,
  INSTAMART_BRANDS,
} from "../../../utils/constants";

export default function TagManagement() {
  const [showPopup, setShowPopup] = useState(false);
  const [blinkitAccounts, setBlinkitAccounts] = useState([]);
  const [flipkartAccounts, setFlipkartAccounts] = useState([]);
  const [amazonAccounts, setAmazonAccounts] = useState([]);
  const [zeptoAccounts, setZeptoAccounts] = useState([]);
  const [instamartAccounts, setInstamartAccounts] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const getAllBrands = async () => {
    const platformValues = _.map(platforms, 'value');
    const apiCalls = [];
    if (platformValues.includes('flipkart')) apiCalls.push(_GET(`${GET_ACCOUNTS}?fromTags=true`));
    if (platformValues.includes('amazon')) apiCalls.push(_GET(`${AMAZON_ACCOUNTS}?fromTags=true`));
    if (platformValues.includes('zepto')) apiCalls.push(_GET(`${GET_ZEPTO_ACCOUNTS}?fromTags=true`));
    if (platformValues.includes('instamart')) apiCalls.push(_GET`${(INSTAMART_BRANDS)}?fromTags=true`);
    if (apiCalls.length === 0) return;
    try {
      const results = await Promise.all(apiCalls);
      let index = 0;
  
      if (platformValues.includes('flipkart')) {
        const flipkartData = results[index].data.data.result;
        const flipkartAccounts = flipkartData.map((item) => ({
          label: item._id.account,
          value: item._id.account,
        }));
        setFlipkartAccounts(flipkartAccounts);
        index++;
      }
  
      if (platformValues.includes('amazon')) {
        const amazonData = results[index].data.data;
        const amazonAccounts = amazonData.map((item) => ({
          label: item.label,
          value: item.label,
        }));
        setAmazonAccounts(amazonAccounts);
        index++;
      }
  
      if (platformValues.includes('zepto')) {
        const zeptoData = results[index].data.data;
        const zeptoAccounts = zeptoData.map((item) => ({
          label: item.account_name,
          value: item.account_name,
        }));
        setZeptoAccounts(zeptoAccounts);
        index++;
      }
  
      if (platformValues.includes('instamart')) {
        const instamartData = results[index].data.data;
        const instamartAccounts = instamartData.map((item) => ({
          label: item.brand,
          value: item.brand,
        }));
        setInstamartAccounts(instamartAccounts);
      }
  
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  const getAccounts = async () => {
    const result = await _POST(GET_COMMON_ACCOUNTS, {
      platforms: JSON.parse(localStorage.getItem("platforms")),
    });
    const data = result.data.data;
    if (!Array.isArray(data)) {
      console.error("Common Account Data  is not an array or is undefined");
      // Handle the error appropriately
      return;
    }

    const accounts = data.map((item) => ({
      label: item.account_name,
      value: item.account_name,
    }));
    setBlinkitAccounts([]);
  };
  useEffect(() => {
    let platforms = localStorage.getItem("platforms");
    if (platforms) {
      platforms = JSON.parse(platforms).platform.map((ele) => {
        return {
          label: capitalizeFirstLetter(ele),
          value: ele,
        };
      });
      setPlatforms(platforms);
    }
  }, []);

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    if (platforms.length > 0) {
      getAllBrands();
    }
  }, [platforms]);
  return (
    <TagManage>
      <div>
        <section className="flex-nowrap border p-4 bg-white sticky top-14 z-40 font-bold">
          Manage Tag
        </section>
        <SearchField
          blinkitAccounts={blinkitAccounts}
          amazonAccounts={amazonAccounts}
          zeptoAccounts={zeptoAccounts}
          instamartAccounts={instamartAccounts}
          flipkartAccounts={flipkartAccounts}
          platforms={platforms}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
        {showPopup && (
          <CreateTagPopup
            setOpenState={setShowPopup}
            platforms={platforms}
            blinkitAccounts={blinkitAccounts}
            amazonAccounts={amazonAccounts}
            zeptoAccounts={zeptoAccounts}
            instamartAccounts={instamartAccounts}
            flipkartAccounts={flipkartAccounts}
          />
        )}

        <TagManagerTable
          platforms={platforms}
          blinkitAccounts={blinkitAccounts}
          amazonAccounts={amazonAccounts}
          zeptoAccounts={zeptoAccounts}
          instamartAccounts={instamartAccounts}
          flipkartAccounts={flipkartAccounts}
        />
      </div>
    </TagManage>
  );
}
