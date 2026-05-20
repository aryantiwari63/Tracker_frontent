import { useState } from "react";
import Tooltip from "../../Amazon/advertise/CampaignManager/createBulkadgroup/Tooltip";

export const Headerbtn = ({
  title,
  imgsrc,
  hoverImgSrc = "",
  type,
  onClick,
  id,
  style,
  active,
  editRef,
  platform,
  disabled,
  icon,
  showToolTip,
  content,
  btnStyle,
  download,
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div className="flex  px-2" ref={editRef}>
      <button
        type={type}
        onClick={() => {
          download && download === 1 ? () => {} : onClick();
        }}
        disabled={disabled}
        style={btnStyle}
        className={[
          "campaign__btn ",
          active && "campaign__btn--active",
          platform === "blinkit" && "campaign__btnblinkit",
          platform === "zepto" && "campaign__btnzepto",
          platform === "instamart" && "campaign__btninsta",
        ].join(" ")}
        id={id}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div>{icon}</div>
        <div className="">
          <img
            className={`header-buttons`}
            src={hover && hoverImgSrc ? hoverImgSrc : imgsrc}
            alt=""
            style={style}
          />
        </div>
        {title && <p className="pl-1">{title}</p>}
      </button>
      {showToolTip ? <Tooltip title={content} /> : null}
    </div>
  );
};
