export default function StarRating({ rating, maxRating = 5 }) {
    return (
      <div className="flex">
        {[...Array(maxRating)].map((_, i) => (
          <Star key={i} filled={i < rating} />
        ))}
      </div>
    )
  }
  
  function Star({ filled }) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={filled ? "#FFD700" : "none"}
        stroke={filled ? "#FFD700" : "#D1D5DB"}
        strokeWidth="2"
        className="mr-1"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  