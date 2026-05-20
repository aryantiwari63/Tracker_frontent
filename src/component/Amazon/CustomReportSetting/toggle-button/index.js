import React from "react";
import "./style.css";

const Toggle = ({ label1, label2, setToggle, platform, toggle }) => {
  return (
    <React.Fragment>
      <label
        style={{ width: "100%", height: 36 }}
        className={[
          "toggleSwitch nolabel ",
          platform === "blinkit" && "toggleSwitch--blinkit ",
          platform === "amazon" && "toggleSwitch--amazon ",
          platform === "zepto" && "toggleSwitch--zepto",
          platform === "instamart" && "toggleSwitch--instamart",
        ].join(" ")}

        // onClick={setVal}
      >
        <input
          type="checkbox"
          onClick={() => {
            if (toggle === "breakdown") setToggle("parameters");
            else setToggle("breakdown");
          }}
          checked={toggle === "breakdown" ? false : true}
        />
        <a></a>
        <span>
          <span className="left-span">{label1}</span>
          <span className="right-span">{label2}</span>
        </span>
      </label>
    </React.Fragment>
  );
};

export default Toggle;
