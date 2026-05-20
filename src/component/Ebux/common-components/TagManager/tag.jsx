import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import ConfirmationModal from '../Popups/ConfirmationModal';

function Tag({ tag_name, tag_color, onRemove, type }) {
    console.log('typetype', type)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        onRemove();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex items-center gap-2 min-w-[110px] border border-gray-300 rounded-lg px-2 py-1 whitespace-normal break-all group/tag relative">
                <div
                    className="w-5 h-5 max-w-5 max-h-5 min-h-5 min-w-5 rounded-full"
                    style={{
                        backgroundColor: tag_color ?? "#ffffff",
                        border:
                            tag_color === "#ffffff"
                                ? "1px solid rgba(0, 0, 0, 0.1)"
                                : "none",
                    }}
                ></div>
                <div className='flex w-full justify-between items-center relative pr-4'>
                    <span className="break-words w-full">{tag_name}</span>
                    {onRemove && !type?.includes('hover') && (
                        <span
                            className="cursor-pointer text-[#00000073] absolute right-0 top-1/2 -translate-y-1/2"
                            onClick={handleRemoveClick}
                        >
                            <IoMdClose size={16} />
                        </span>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                message="Remove this tag from the selected item?"
            />
        </>
    )
}

export default Tag;