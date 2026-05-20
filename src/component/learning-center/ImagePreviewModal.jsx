import React from 'react'

function ImagePreviewModal({previewImg, setPreviewImg}) {
  return (
     <div className="fixed inset-0 z-[99999] flex items-center justify-center">
    
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setPreviewImg(null)}
    />

    {/* Modal */}
    <div className="relative w-[80%] h-[80%] bg-white rounded-xl shadow-2xl border flex flex-col">
      
      <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-xl px-4">
        <p className="font-semibold text-gray-700 text-sm">
          Image Preview
        </p>
        <button
          onClick={() => setPreviewImg(null)}
          className="text-lg font-bold text-gray-600 hover:text-black"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-auto w-full h-full flex items-center justify-center p-4">
        <img
          src={previewImg}
          alt="Preview"
          className="w-full h-full max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  </div>
  )
}

export default ImagePreviewModal