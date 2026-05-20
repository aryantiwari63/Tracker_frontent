import { useHistory } from "react-router-dom/cjs/react-router-dom";
import "./styles.css"

// Inside CampaignTypeCard component
const CampaignTypeCard = ({ image, title, content,  navigateLink, disabled }) => {
  const history = useHistory();

  const handleClick = () => {
    if (!disabled) {
      history.push(navigateLink);
    }
  };

  return (
    <button
      className={`row campaignpopup_box ${disabled ? 'disabled' : ''}`}
      type="button"
      onClick={handleClick}
      disabled={disabled}
    >
      <button className={`col_4 ${disabled ? 'disabled' : ''}`} type="button">
        <div className=""></div>
        <div className="campaignpopup__images">
          <img src={image} height="100%" width="100%" alt="popup" />
        </div>
      </button>
      <div className="col_8 ">
        <div className="">
          <h5 className="campaignpopup__title">{title}</h5>
          <p className="campaignpopup__content">{content}</p>
        </div>
      </div>
    </button>
  );
};
export default CampaignTypeCard 
