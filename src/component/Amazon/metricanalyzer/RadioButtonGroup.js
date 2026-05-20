import React, { useState } from "react";
import "./styles.css";


const RadioButtonGroup = () => {
  const options = [
    { id: "top-performing", label: "Top Performing" },
    { id: "low-performing", label: "Low Performing" },
    { id: "all", label: "All" },
  ];

  const [selectedOption, setSelectedOption] = useState("top-performing");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="row px-4 pb-4">
      {options.map((option) => (
        <div key={option.id} className="pr-3 ">
          <input
            type="radio"
            id={option.id}
            name="performance-options"
            value={option.id}
            checked={selectedOption === option.id}
            onChange={handleOptionChange}
            className="custom-radio"
          />
          <label htmlFor={option.id} className="text-sm">{option.label}</label>
        </div>
      ))}
     
    </div>
  );
};

export default RadioButtonGroup;
