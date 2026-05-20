import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="bg-white rounded-[28px] p-8 shadow-xl max-w-[320px] w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-10">
                    <h3 className="text-[20px] font-medium text-black leading-snug">
                        {message || "Remove this tag from the selected item?"}
                    </h3>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                        className="flex-1 bg-[#0081F7] hover:bg-[#40a9ff] text-white py-3 rounded-[16px] font-semibold text-[16px] transition-all"
                    >
                        YES
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCancel();
                        }}
                        className="flex-1 bg-white hover:bg-gray-50 text-[#595959] border border-[#d9d9d9] py-3 rounded-[16px] font-semibold text-[16px] transition-all"
                    >
                        NO
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
