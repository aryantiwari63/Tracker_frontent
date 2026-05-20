import React, { useState } from "react";

const ConfirmationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    // Handle the delete action here
    // console.log("Item deleted");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Item
      </button>

      {isModalOpen && (
        <div className="w-[416px]">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <div className="flex">
              <button onClick={handleCloseModal}>
              <img
                src="/assets/images/ebux-flipkart/CloseCircle.svg"
                alt="cross"
                className="pb-8 px-2"
              />
              </button>
            
              <h2 className="text-sm font-normal mb-4">
                Are you sure you want to delete <br />
                <span className="font-medium text-black">
                  “Republic Day Sale”
                </span>
                Date Range?
              </h2>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationModal;
