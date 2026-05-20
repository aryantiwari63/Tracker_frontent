import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getKeywordList } from "../../../../../../redux/action-creator/campaignAction";
import { useLocation } from "react-router";

const KeywordsLeftBlock = ({
  onBroadKeysChange,
  onExactKeysChange,
  campaignData,
  setBroadKeyword,
  broadKeyword,
  setExactKeyword,
  exactKeyword,
}) => {
  // const [broadKeyword, setBroadKeyword] = useState([]);
  // const [exactKeyword, setExactKeyword] = useState([]);
  const { keywordList } = useSelector((state) => state.CampaignReducer);
  const location = useLocation();
  const campaignId = location?.state;
  React.useEffect(() => {
    if (campaignId) {
      if (campaignData.keywords_broad) {
        setBroadKeyword([...campaignData.keywords_broad]);
      }
      if (campaignData.keywords_exact) {
        setExactKeyword([...campaignData.keywords_exact]);
      }
    }
  }, []);
  React.useEffect(() => {
    // console.log("campaignData broadKeyword", broadKeyword);
    // console.log("campaignData exactKeyword", exactKeyword);
  }, [broadKeyword, exactKeyword]);

  const handleBroadClick = (e) => {
    if (!broadKeyword.includes(e)) {
      const updatedBroadKeys = [...broadKeyword, e];
      setBroadKeyword(updatedBroadKeys);
      onBroadKeysChange(updatedBroadKeys);

      // Remove value from exactKeyword if present
      const updatedExactKeys = exactKeyword.filter((value) => value !== e);
      setExactKeyword(updatedExactKeys);
      onExactKeysChange(updatedExactKeys);
    }
  };

  const handleExactClick = (e) => {
    if (!exactKeyword.includes(e)) {
      const updatedExactKeys = [...exactKeyword, e];
      setExactKeyword(updatedExactKeys);
      onExactKeysChange(updatedExactKeys);

      // Remove value from broadKeyword if present
      const updatedBroadKeys = broadKeyword.filter((value) => value !== e);
      setBroadKeyword(updatedBroadKeys);
      onBroadKeysChange(updatedBroadKeys);
    }
  };

  // const keywordsearchlist = [
  //   {
  //     label: "Fabric Soften",
  //   },
  //   {
  //     label: "Jewellery",
  //   },
  //   {
  //     label: "Chocolate Box",
  //   },
  //   {
  //     label: "Brass Copper",
  //   },
  //   {
  //     label: "Chocolate Pack",
  //   },
  //   {
  //     label: "Bottle",
  //   },
  //   {
  //     label: "Bathroom",
  //   },
  // ];
  const dispatch = useDispatch();
  return (
    <>
      <div className="keyword-left">
        {/* <form className="relative pl-2 pr-2 "> */}
        <div className="relative pl-2 pr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="keyword__searchimg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="keywordtab__search rounded"
            onChange={(e) => {
              if (e.keyCode == 13) {
                e.preventDefault();
              }
              dispatch(getKeywordList(campaignData.brand, e.target.value));
            }}
          />
        </div>
        {/* </form> */}

        <div className="keyword__wrap">
          <div className="callout-img">
            <img src="/assets/images/info-orange.svg" alt="" />
          </div>
          <p className="callout">
            You can now target competition keywords <a href="#">Know more</a>
          </p>
        </div>
        <div className="col">
          <div className="keyword__seacrhitems">
            {keywordList && keywordList.length > 0
              ? keywordList.map((value) => {
                  return (
                    <div className="keyword__searchlist row" key={value._id}>
                      <div className="keyword__searchlist-value">
                        {value.keyword}
                      </div>
                      <div className="col keyword__addto">
                        <div className="row items-center justify-end">
                          <div className="keyword__addbtn">Add to</div>
                          <div>
                            <button
                              className="keyword__broadbtn"
                              onClick={() => {
                                handleBroadClick(value.keyword);
                              }}
                            >
                              Broad
                            </button>
                          </div>
                          <div>
                            <button
                              className="keyword__exactbtn"
                              onClick={() => handleExactClick(value.keyword)}
                            >
                              Exact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordsLeftBlock;
