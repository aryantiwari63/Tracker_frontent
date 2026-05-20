import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionList } from "../../../../../../redux/action-creator/blinkit/createCampaignAction";

const CollectionLeftPanel = ({ selectedData, setSelectedData }) => {
  let { collectionList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );

  const [listData, setListData] = React.useState([]);
  // const [selectedData, setSelectedData] = React.useState([]);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getCollectionList({ search: "" }));
  }, []);
  React.useEffect(() => {
    setListData([...collectionList]);
  }, [collectionList]);
  const inputRef = useRef(null);
  const optionOuterRef = useRef(null);
  const [text, setText] = React.useState("");
  const handleSelect = (item) => {
    setSelectedData([item]);
    let optionOuter = optionOuterRef.current;
    optionOuter.classList.remove("searchProduct__options--show");
    setText("");
  };
  const handleDeleteItem = () => {
    setSelectedData([]);
  };

  React.useEffect(() => {
    dispatch(getCollectionList({ search: text }));
  }, [text]);

  return (
    <div className="leftpanel_container">
      <div className="blinkit_leftpanel_stepthree">
        <div className="blinkit_leftpanel__selected-title">
          <div>
            <b>Select from existing collections</b>
            <div>Get products from your exsting collection</div>
          </div>
        </div>
        <div className="flex pt-4">
          <div className="relative w-full">
            <div
              className="row searchfieldblinkit"
              onClick={() => {
                inputRef.current.focus();
                let optionOuter = optionOuterRef.current;
                optionOuter.classList.add("searchProduct__options--show");
              }}
            >
              {selectedData?.map((item, i) => {
                return (
                  <button
                    key={i}
                    className=" searchproductfield__selectedoptions"
                  >
                    {item.name}
                    <button
                      className="px-1"
                      id={item.id}
                      onClick={handleDeleteItem}
                    >
                      X
                    </button>
                  </button>
                );
              })}
              <div className="col">
                <input
                  type="text"
                  ref={inputRef}
                  value={text}
                  placeholder={"Search from existing brand collections"}
                  className=" searchproductfield__search"
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
            <div
              className="searchProduct__options absolute top-full left-0 w-full border"
              ref={optionOuterRef}
            >
              <div className="blinkit_searchproductfield__options overflow-y-scroll">
                {listData?.map((item, i) => {
                  return (
                    <div key={i}>
                      <div
                        id={item.id}
                        onClick={() => handleSelect(item)}
                        className="searchproductfield__list"
                      >
                        {item.id} - {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionLeftPanel;
