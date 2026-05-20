import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import InfoCard from './InfoCard';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


export default function CategoryItem({
  title,
  img,
  iconBg,
  openCategory,
  setOpenCategory,
    // previewImg,
  setPreviewImg,
  //data,
}) {
  const isOpen = openCategory.includes(title);
 

  const toggleCategory = () => {
    setOpenCategory((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };
  return (
    <div className="border rounded-xl overflow-hidden">
      <div
        onClick={toggleCategory}
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`${iconBg}  w-8 h-8 shrink-0 flex items-center justify-center rounded-lg`}
          >
            <img src={img} alt={title} className="w-4 h-4"/>
          </div>
          <span className="text-base font-medium text-gray-800">{title}</span>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="bg-gray-50 p-3 space-y-3 text-sm">
          {/* {data[title]?.map((item, index) => (
            <InfoCard key={index} {...item} />
          ))} */}
          {title === "On-Shelf Availability" && (
            <>
              {/* 1st subfield */}
              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  On-Shelf availability-
                </p>
                <p className="mb-4">
                  <span className="font-semibold">
                    On-Shelf Availability (OSA)
                  </span>{" "}
                  is a metric that measures the{" "}
                  <span className="font-semibold">
                    percentage of time a product is available (visible and
                    purchasable)
                  </span>{" "}
                  to consumers on a platform (online or offline) during a
                  defined period, geography, and assortment.
                </p>

                <p className="mb-2">
                  For{" "}
                  <span className="font-semibold">
                    online platforms like Amazon
                  </span>
                  , a product is considered{" "}
                  <span className="font-semibold">“on shelf”</span> if:
                </p>

                <ul className="list-disc pl-10 mb-6 space-y-2">
                  <li>
                    The product listing is{" "}
                    <span className="font-semibold">visible</span>
                  </li>
                  <li>
                    The product is{" "}
                    <span className="font-semibold">in stock</span>
                  </li>
                  <li>
                    The product can be{" "}
                    <span className="font-semibold">
                      added to cart / purchased
                    </span>
                  </li>
                </ul>

                <p className="mb-3">OSA is typically calculated as —</p>

                <div className="border-t pt-4 text-center font-semibold">
                  <p className="">
                    OSA (%) = (Number of days product was available / Total
                    number of days observed) × 100
                  </p>
                </div>
              </div>

              {/* 2nd subfield (Example) */}
              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Example-
                </p>
                <p className="mb-2">
                  For{" "}
                  <span className="font-semibold">
                    online platforms like Amazon
                  </span>
                  , a product is considered{" "}
                  <span className="font-semibold">“on shelf”</span> if:
                </p>

                <ul className="list-disc pl-8 space-y-2 mb-6">
                  <li>
                    The product listing is{" "}
                    <span className="font-semibold">visible</span>
                  </li>
                  <li>
                    The product is{" "}
                    <span className="font-semibold">in stock</span>
                  </li>
                  <li>
                    The product can be{" "}
                    <span className="font-semibold">
                      added to cart / purchased
                    </span>
                  </li>
                </ul>

                <div className="flex justify-center">
                  <img
                    src="/assets/images/on-shelfexample.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                    onClick={() => setPreviewImg("/assets/images/on-shelfexample.svg")}
                  />
                </div>
              </div>
            </>
          )}

          {title === "Share of Search (SOS) and Ranking" && (
            <>
              <div className="bg-white border rounded-xl p-4">
                {/* Title */}
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Share of Search-
                </p>

                {/* Definition */}
                <p className="mb-4">
                  <span className="font-semibold">Share of Search (SoS)</span>{" "}
                  measures the{" "}
                  <span className="font-semibold">
                    visibility dominance of a brand or product in on-platform
                    search results
                  </span>{" "}
                  by calculating the proportion of times it appears (or appears
                  prominently) for a defined set of keywords, geographies, and
                  time period.
                </p>

                {/* Condition Intro */}
                <p className="mb-2">
                  For{" "}
                  <span className="font-semibold">
                    e-commerce platforms like Amazon
                  </span>
                  , a product is considered to have{" "}
                  <span className="font-semibold">search presence</span> if it:
                </p>

                {/* Bullet Points */}
                <ul className="list-disc pl-8 space-y-2">
                  <li>
                    Appears in the{" "}
                    <span className="font-semibold">search results</span> for a
                    tracked keyword
                  </li>
                  <li>
                    Often within a{" "}
                    <span className="font-semibold">
                      defined rank threshold
                    </span>{" "}
                    (e.g., Top 10, Top 20)
                  </li>
                </ul>
              </div>

              <div className="bg-white border rounded-xl p-4">
                {/* Title */}
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Ranking-
                </p>

                <p className="mb-2">
                  Ranking refers to the average position at which a product
                  appears in search results for a defined keyword.
                </p>
                <p className="mb-2">
                  For platforms like Amazon, ranking captures how high or low a
                  product is placed when a shopper searches for a specific
                  keyword.
                </p>
                <ul className="list-decimal mb-2 ml-4">
                  <li>Lower rank number = better visibility</li>
                  <li>Rank 1 = top result on the search page</li>
                </ul>
                <p className="mb-1">
                  Rankings are typically divided into two types:
                </p>

                <ul className="list-decimal ml-4">
                  <li>
                    <sapn className="font-semibold">Paid ( Sponsored )</sapn> -
                    Appears as ads at top/middle of search results
                  </li>
                  <li>
                    <sapn className="font-semibold">Organic</sapn> - Determined
                    by the platform’s algorithm
                  </li>
                </ul>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Types of SoS -
                </p>

                <p>SoS is typically calculated as:</p>
                <p>
                  SoS% = (Search appearances of the product/ Total search
                  opportunities) x 100
                </p>
                <p>It is of two types - </p>
                <p className="font-semibold">Organic</p>
                <ul className="list-disc mb-2 ml-4">
                  <li>
                    Paid SoS = (Brand’s sponsored slots/ Total sponsored slots)
                    x 100
                  </li>
                  <li>Organic</li>
                </ul>
                <p className="font-semibold">Organic</p>
                <ul className="list-disc ml-4">
                  <li>
                    {" "}
                    Organic SoS = (Brand’s Organic slots/ Total Organic slots) x
                    100
                  </li>
                </ul>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Types of Ranking -
                </p>
                <p className="font-semibold mb-1">
                  Paid = (Sum of ranks of brand’s sponsored products/ number of
                  sponsored products)
                </p>
                <p className="font-semibold">
                  Organic = (Sum of ranks of brand’s organic products/ number of
                  organic products)
                </p>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  SoS Example -{" "}
                </p>
                <div>
                  <p>Given</p>
                  <p className="font-semibold">Observation days - 5</p>
                  <p className="font-semibold">Pin codes - 5</p>
                  <p className="font-semibold">Keywords tracked - protein</p>
                  <p>Logic:</p>
                  <p className="font-semibold">
                    1 = Product appears in Top 10 search result
                  </p>
                  <p className="font-semibold">
                    0 = Product does not appear in Top 10
                  </p>
                </div>

                <div className="flex justify-center mt-2">
                  <img
                    src="/assets/images/sos-example.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                     onClick={() => setPreviewImg("/assets/images/sos-example.svg")}
                  />
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-gray-800 mb-2 text-start font-medium">
                  Ranking Example -
                </p>
                <div>
                  <p>Given</p>
                  <p>Observation days - 5</p>
                  <p>Pin codes - 5</p>
                  <p>Keywords tracked - protein</p>
                  <p>
                    Logic: Rank appears only when product appears in, say, top
                    10 searches, else 0
                  </p>
                </div>
                <div className="flex justify-center mt-2">
                  <img
                    src="/assets/images/ranking-example.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                     onClick={() => setPreviewImg("/assets/images/ranking-example.svg")}
                  />
                </div>
              </div>
            </>
          )}

          {title === "Content Score" && (
            <>
              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Description Quality Score-
                </p>

                <p className="mb-2">
                  Required content elements that decide the content score are:
                  Product title,images, description and bullet points.
                </p>
                <ul className="list-disc mb-2 ml-4">
                  <li>
                    Product title - The main name of the product that clearly
                    identifies what it is.
                  </li>
                  <li>Images - Visual representations of the product.</li>
                  <li>
                    Description - A detailed explanation of the product, its
                    features, benefits, and usage.
                  </li>
                  <li>
                    Bullet points - Key features and highlights of the product
                    presented in concise, easy-to-read points.
                  </li>
                </ul>
                <p>
                  For every SKU, total content score is checked (1 if the
                  content element is present, 0 otherwise)
                </p>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Content Score-
                </p>

                <p className="mb-2">
                  Required content elements that decide the content score are:
                  Content Score tells us how complete and good the product
                  information is on the app/website. Think like this:
                </p>

                <ul className="list-disc  ml-4">
                  <li>
                    If a product page has Product name, title, images,
                    description, bullets→ good content
                  </li>
                  <li>If things are missing → bad content</li>
                </ul>

                <div className="mt-2 flex flex-col gap-1">
                  <p>Higher score → better discoverability & conversion</p>
                  <p>
                    Content score = Sum of content score of all SKUs/ Number of
                    SKUs
                  </p>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Content Score Example -
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <p>
                      Step 1) For 1 SKU in one pin code in one day let’s say, we
                      have content score as shown below
                    </p>
                    <div className="flex justify-center my-2">
                      <img
                        src="/assets/images/contentscore-example.svg"
                        alt="OSA Example Table"
                        className="w-full  border border-gray-300 shadow-sm"
                        onClick={() => setPreviewImg("/assets/images/contentscore-example.svg")}
                      />
                    </div>
                  </div>

                  <div>
                    <p>Step 2) Now convert it to percentage</p>
                    <p>
                      Content score = (Elements present/Total required elements)
                      x 100 = (3/4) x 100 = 75%
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p>
                      Step 3) Now do the same for all the SKUs. Suppose we have
                      5 SKUs, then-
                    </p>
                    <div className="flex justify-center my-2">
                      <img
                        src="/assets/images/contentscore-example.svg"
                        alt="OSA Example Table"
                        className="w-full  border border-gray-300 shadow-sm"
                        onClick={() => setPreviewImg("/assets/images/contentscore-example.svg")}
                      />
                    </div>
                  </div>
                </div>

                <p className="font-semibold mt-1">
                  Avg content score = (75 + 100 + 85.7 + 57.1 + 100)/5 = 83.6%
                </p>
              </div>
            </>
          )}

          {title === "Promotions" && (
            <>
              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Promotions-
                </p>

                <p className="mb-2">
                  Promotion means the difference between the selling price SP
                  and MRP
                </p>

                <p className="mb-2">
                  Promotions are special offers or discounts designed to
                  incentivize consumers to purchase your products.
                </p>
                <p>
                  If Selling Price &lt; MRP - Item is on promotion, else not.
                </p>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-gray-800 mb-2 text-start font-medium">
                  Formula -
                </p>

                <p className="">
                  Promotions = [ (Total MRP - Total SP)/ Total MRP ] x 100
                </p>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Content ScoPromotions Example -
                </p>

                <div>
                  <p>
                    If Selling Price &lt; MRP - Item is on promotion, else not.
                  </p>
                  <p>Let’s take 5 items (same day, same time)</p>
                </div>

                <div className="flex justify-center my-2">
                  <img
                    src="/assets/images/promotion-example.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                     onClick={() => setPreviewImg("/assets/images/promotion-example.svg")}
                  />
                </div>

                <div>
                  <p>Only add promoted items:</p>
                  <p>
                    ∑ MRP = 50 + 200 + 120 + 80 + 100 = 450 ∑ SP = 25 + 40 + 90
                    + 64 + 100 = 219
                  </p>
                  <p>Promotions = [ (450 – 219) / 450 ] X 100 = 51.33%</p>
                </div>
              </div>
            </>
          )}

          {title === "Ratings and Reviews" && (
            <>
              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Ratings and reviews -
                </p>

                <p>
                  A product’s rating, along with the number of reviews it
                  receives, plays a significant role in building consumer trust
                  and improving its position in search rankings
                </p>
                <ul className="list-disc ml-4">
                  <li>
                    Ratings reflect the average customer score (usually 1–5
                    stars)
                  </li>
                  <li>
                    Reviews reflect the volume and content of customer feedback
                  </li>
                </ul>

                <div className="mt-2">
                  <p>
                    Rating is the weighted mean of all star ratings received by
                    a product up to a given date
                  </p>
                  <p>
                    Reviews are the customer feedbacks received during the time
                    period.
                  </p>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-[#000000] mb-2 text-start font-semibold">
                  Ratings Example -
                </p>
                <div>
                  Let’s take ratings for a certain product over the time a shown
                  below -
                </div>

                <div className="flex justify-center my-2">
                  <img
                    src="/assets/images/rating.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                    onClick={() => setPreviewImg("/assets/images/rating.svg")}
                  />
                </div>

                <div className="flex justify-center my-2">
                  <img
                    src="/assets/images/ratingformula.svg"
                    alt="OSA Example Table"
                    className="w-full  border border-gray-300 shadow-sm"
                       onClick={() => setPreviewImg("/assets/images/ratingformula.svg")}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div>
                    <p>Step 1: Weighted sum:</p>
                    <p>
                      (5 x 60) + (4 x 25) + (3 x 8) + (2 x 4) + (1 x 3) = 435
                    </p>
                  </div>
                  <div>
                    <p>Step 2: Total ratings:</p>
                    <p>60 + 25 + 8 + 4 + 3 = 100</p>
                  </div>
                  <div>
                    <p>Step 3: Avg rating:</p>
                    <p>435/100 = 4.35</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

  


    </div>
  );
}
