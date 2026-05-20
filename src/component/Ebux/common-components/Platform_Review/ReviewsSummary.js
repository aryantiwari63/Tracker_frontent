import StarRating from "./StarRating"

export default function ReviewSummary({ summary }) {
  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4 z-30">
      <div className="flex gap-4">
        <div className="text-center w-[400px]">
         
        </div>
        
          <div className="text-center w-30">
          <div className="text-sm text-gray-500">Total Reviews</div>
          <div className="font-bold text-xl">{summary.total_reviews.toLocaleString()}</div>
        </div>
         
         <div className="text-center w-[200px]">
         
        </div>

        <div className="text-center mx-8">
          <div className="text-sm text-gray-500">Average Rating</div>
          <div className="flex justify-center items-center ">
            <StarRating rating={Math.round(summary.avg_rating)} />
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500">Total Platforms</div>
          <div className="font-bold text-xl">{summary.total_platforms}</div>
        </div>
 <div className="text-center w-60">
         
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Total Products</div>
          <div className="font-bold text-xl">{summary.total_products.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
