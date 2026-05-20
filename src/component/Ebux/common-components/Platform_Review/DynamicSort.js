export default function SortingButton({ sortType }) {
    return (
      <div className="inline-flex flex-col ml-1 h-4 justify-center">
        <svg
          width="8"
          height="4"
          viewBox="0 0 8 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`mb-0.5 ${sortType === "ASC" ? "text-black" : "text-gray-400"}`}
        >
          <path d="M4 0L7.4641 4H0.535898L4 0Z" fill="currentColor" />
        </svg>
        <svg
          width="8"
          height="4"
          viewBox="0 0 8 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sortType === "DSC" ? "text-black" : "text-gray-400"}`}
        >
          <path d="M4 4L0.535898 0H7.4641L4 4Z" fill="currentColor" />
        </svg>
      </div>
    )
  }
  