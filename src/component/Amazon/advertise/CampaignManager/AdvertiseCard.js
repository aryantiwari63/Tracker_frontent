import React from "react";
import Card from "../../../flipkart/Card";
const AdvertiseCard = () => {
  return (
    <>
    <div className="row">
    <div className=" amazon__advertisecard">
        <Card cardtitle="Impressions" currency="36.8M" withoutPercent/>
      </div>
      <div className=" amazon__advertisecard">
        <Card cardtitle="Sale Units" currency="74.1M" withoutPercent/>
      </div>
      <div className="amazon__advertisecard">
        <Card cardtitle="Clicks" currency="132.3K" withoutPercent/>
      </div>
      <div className=" amazon__advertisecard">
        <Card cardtitle="ROAS" currency="5.06" withoutPercent/>
      </div>
      <div className="amazon__advertisecard">
        <Card cardtitle="Orders" currency="62.1K" withoutPercent/>
      </div>
      <div className="amazon__advertisecard">
        <Card cardtitle="Spend" currency="3.8M" withoutPercent/>
      </div>
      <div className=" amazon__advertisecard">
        <Card cardtitle="Sales" currency="19.3M" withoutPercent/>
      </div>
      <div className="amazon__advertisecard">
        <Card cardtitle="CPC" currency="28.79M" withoutPercent/>
      </div>
      <div className="amazon__advertisecard">
        <Card cardtitle="CTR" currency="0.36%" withoutPercent/>
      </div>
      <div className="amazon__advertisecard">
        <Card cardtitle="" currency="" withoutPercent/>
      </div>
      </div>
     
    </>
  );
};
export default AdvertiseCard;
