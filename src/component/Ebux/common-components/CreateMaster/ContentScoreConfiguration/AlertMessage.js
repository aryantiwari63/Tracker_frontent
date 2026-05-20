import React from "react";

export default function AlertMessage({ type = "success", message = "", onClose }) {
    const isError = type === "error";

    return (
        <div
            className={`flex justify-between items-start px-4 py-3 rounded-md border ${isError
                    ? "bg-red-100 border-red-300 text-red-700"
                    : "bg-green-100 border-green-300 text-green-700"
                }`}
        >

            {/* Left Section */}
            <div className="flex items-start gap-2">
                <svg
                    className="w-5 h-5 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isError ? (
                        // Error icon
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
              1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16
              c-.77 1.333.192 3 1.732 3z"
                        />
                    ) : (
                        // Success icon
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    )}
                </svg>

                <p className="text-sm">{message}</p>
            </div>

            {/* Close Button */}
            {
                type == 'success' && (
                    <button
                        onClick={onClose}
                        className={`${isError ? "text-red-700 hover:text-red-900" : "text-green-700 hover:text-green-900"} ml-3`}
                    >
                        ✕
                    </button>
                )
            }


        </div>
    );
}
