import React from "react";
import Spinner from "./Spinner"; // Adjust the path if necessary

const Button = ({ onClick, loading, children, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative inline-flex items-center px-4 py-2 font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {loading && <Spinner />}
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
