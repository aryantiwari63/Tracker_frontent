/* eslint-disable no-console */
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { _POST } from "../../../services/axios.method";
import { cancelRequest } from "../../../utils/helpers";
import Button from "../Common/Button";

const UserForm = ({
  onClose,
  formData,
  onChange,
  onSubmit,
  isModalOpen,
  loading,
  owner_info,
}) => {
  // console.log("p;atfpr>>>>>>>>>.", formData);
  const owner_platform = formData.id
    ? formData.owner_platform.map((val) => val.platform_id)
    : formData.platform_details.map((val) => val.platform_id);

  // console.log("owner_platform>>>>>>>>>>>>>>>", owner_info);

  let combinedData = formData?.owner_platform
    ? formData?.owner_platform
    : formData.platform_details;
  const groupedData = combinedData.reduce((acc, platform) => {
    if (!acc[platform.platform_id]) {
      acc[platform.platform_id] = [];
    }

    const brandIds = platform.brands
      .map((brand) => brand.brand_id)
      .filter((id) => id !== null);
    acc[platform.platform_id].push(...brandIds);

    return acc;
  }, {});

  // Convert the grouped data into an array of objects
  const [errors, setErrors] = useState({});
  const [dropdown, setDropdown] = useState({
    open_id: false,
    position: false,
  });
  // console.log("openModal>>>>>>>", isModalOpen);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (!event.target.dataset.dropdown) {
      setDropdown({ open_id: false, position: false });
    }
  };

  const toggleDropdown = (id) => {
    // console.log("id: ", id);
    if (dropdown?.open_id === id)
      setDropdown({ open_id: false, position: "below" });
    else setDropdown({ open_id: id, position: "below" });
  };

  const checkIfEmailExist = async () => {
    try {
      const ourRequest = await cancelRequest();
      const validationErrors = validate();
      if (validationErrors.email === "" || !validationErrors.email) {
        const res = await _POST(
          `/commonscreen/checkemail`,
          {
            user_id: formData.id,
            email: formData.email,
            type: formData.id ? "edit" : "create",
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        if (res?.data?.data) {
          if (res?.data?.data.isExist)
            setErrors((prevErrors) => ({
              ...prevErrors,
              ["email"]:
                res?.data?.data.isExist.length > 0 ? "Email Already exist" : "",
            }));
          // else
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useLayoutEffect(() => {
    if (dropdown.open_id && buttonRef.current) {
      // console.log("open_id: ", dropdown.open_id);
      // console.log("buttonRef: ", buttonRef.current);
      // console.log("dropdownRef: ", dropdownRef.current);
      // Use requestAnimationFrame to ensure dropdown is rendered
      if (dropdownRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        const position =
          spaceBelow >= dropdownRect.height
            ? "below"
            : spaceAbove >= dropdownRect.height
            ? "above"
            : "below";

        setDropdown((prev) => ({ ...prev, position }));
      }
    }
  }, [dropdown.open_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const { email } = errors;
    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    } else if (email && email.trim().length > 0)
      newErrors.email = "Email Already exist";

    // if (!formData.mobile) {
    //   newErrors.mobile = "Mobile number is required";
    // } else if (!/^\d+$/.test(formData.mobile)) {
    //   newErrors.mobile = "Mobile number must be digits only";
    // }

    const platforms = formData.platform_details || [];
    let isAnyPlatformSelected = false;

    platforms.forEach((platform) => {
      if (platform.selected) {
        isAnyPlatformSelected = true;
        if (platform.brands.length > 0) {
          const hasSelectedBrand = platform.brands.some(
            (brand) => brand.selected
          );
          if (!hasSelectedBrand) {
            newErrors[
              platform.platform_id
            ] = `At least one account must be selected`;
          }
        }
      }
    });

    if (!isAnyPlatformSelected) {
      newErrors.platforms = "At least one platform must be selected";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSubmit();
    }
  };

  const handlePlatformChange = (platform_id) => {
    const updatedPlatforms = formData?.platform_details.map((platform) => {
      if (platform.platform_id === platform_id) {
        let brands = platform.brands.map((brand) => {
          return { ...brand, selected: false };
        });
        return { ...platform, selected: !platform.selected, brands };
      }
      return platform;
    });
    onChange("platform_details", updatedPlatforms);
    setErrors((prevErrors) => ({ ...prevErrors, ["platforms"]: "" }));
    // setPlatformAccount(updatedPlatforms);
  };

  const handleBrandChange = (platform_id, brand_id, selectAll = false) => {
    const updatedPlatforms = formData?.platform_details.map((platform) => {
      if (platform.platform_id === platform_id) {
        const isAllSelected = isChecked(platform.brands);

        const updatedBrands = platform.brands.map((brand) => {
          if (selectAll) {
            if (groupedData[platform_id].includes(brand.brand_id))
              return { ...brand, selected: !isAllSelected };
            else return { ...brand };
          } else if (brand.brand_id === brand_id) {
            return { ...brand, selected: !brand.selected };
          }
          return brand;
        });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [platform.platform_id]: "",
        }));
        return { ...platform, brands: updatedBrands };
      }

      return platform;
    });

    onChange("platform_details", updatedPlatforms);
  };

  const isChecked = (brands) => brands.every((obj) => obj["selected"] === true);

  const getSelectedNames = (brands) =>
    brands.filter((obj) => obj["selected"]).map((obj) => obj["brand_name"]);

  const getDisplayText = (brands) => {
    const selectedNames = getSelectedNames(brands);
    if (selectedNames.length > 0) {
      return selectedNames.join(", ");
    }
    return "Select All";
  };

  const checkisDisabled = (groupedData, platform_brand) => {
    const isDisbaled = platform_brand.filter((element) =>
      groupedData.includes(element.brand_id)
    );
    // console.log("isDisbaled>>>>>>>>>>>.", isDisbaled);
    return isDisbaled.length === 0 ? true : false;
  };

  return (
    <div className="fixed inset-0 flex overflow-y-auto items-center justify-center z-50">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg  z-10">
        <div className="flex justify-between items-center bg-[#EAEAEA] px-6 py-3">
          <h2 className="text-xl font-bold ">
            {formData.username ? "Edit User" : "Add User"}
          </h2>
          <button className="close-btn text-2xl" onClick={() => onClose()}>
            &times;
          </button>
        </div>
        <div className="p-6">
          {isModalOpen === "full" && (
            <>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-[#000000]">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`border border-gray-300 rounded-md w-full outline-none focus:border-blue-500 p-2 ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  placeholder="Username"
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-[#000000]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border border-gray-300 rounded-md w-full outline-none focus:border-blue-500 p-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Email"
                  required
                  onBlur={checkIfEmailExist}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
              {/* <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-[#000000]">
            Mobile
          </label>
          <div className="flex items-center">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className={`border border-gray-300 rounded-l-md  outline-none focus:border-blue-500 p-[8.5px] ${
                errors.mobile ? "border-red-500" : ""
              }`}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
            </select>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`border border-gray-300 rounded-r-md outline-none focus:border-blue-500 w-full p-2 ${
                errors.mobile ? "border-red-500" : ""
              }`}
              placeholder="Mobile Number"
              required
            />
          </div>
          {errors.mobile && (
            <p className="text-red-500 text-xs">{errors.mobile}</p>
          )}
        </div> */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-[#000000]">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md w-full outline-none focus:border-blue-500 p-2"
                >
                  {/* <option value="Owner">Owner</option> */}
                  <option value="admin" disabled={owner_info?.role === "admin"}>
                    Admin
                  </option>
                  <option value="manager">Manager</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>
            </>
          )}
          <div className="flex ">
            <div className="w-[47%]">
              <h3 className="text-sm font-medium text-[#000000] mb-2">
                Platforms
              </h3>
            </div>
            <div className="w-[6%]"></div>
            <div className="w-[47%]">
              <h3 className="text-sm font-medium text-[#000000] mb-2">
                Accounts
              </h3>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col w-[47%]">
              {formData?.platform_details.map((platform) => (
                <>
                  <div
                    key={platform.platform_id}
                    className={`flex items-center ${
                      !errors[platform.platform_id] ? "mb-2" : "border-red-500"
                    } border p-[6px] w-[90%] ${
                      !owner_platform.includes(platform.platform_id)
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } rounded-md`}
                    onClick={() => {
                      if (owner_platform.includes(platform.platform_id))
                        handlePlatformChange(platform.platform_id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={platform.selected}
                      onChange={() => {
                        if (owner_platform.includes(platform.platform_id))
                          handlePlatformChange(platform.platform_id);
                      }}
                      disabled={!owner_platform.includes(platform.platform_id)}
                      className={`mr-2 ${
                        !owner_platform.includes(platform.platform_id)
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    />
                    <label
                      className={`text-sm font-medium text-[#000000] ${
                        !owner_platform.includes(platform.platform_id)
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {platform.platform_title}
                    </label>
                  </div>
                  {errors[platform.platform_id] && (
                    <p className="text-red-500 text-xs mb-2">
                      {errors[platform.platform_id]}
                    </p>
                  )}
                </>
              ))}
            </div>

            <div className="w-[6%]"></div>
            <div className="flex flex-col w-[47%]">
              {formData?.platform_details.map((platform, i) => (
                <>
                  <div
                    className={` ${
                      !platform.selected
                        ? "opacity-50 pointer-events-none "
                        : ""
                    } flex items-center ${
                      !errors[platform.platform_id] ? "mb-2" : "border-red-500"
                    } border p-[6px] relative rounded-md ${
                      platform?.brands.length > 0 &&
                      owner_platform.includes(platform.platform_id) &&
                      !checkisDisabled(
                        groupedData[platform.platform_id],
                        platform?.brands
                      )
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                    key={`${platform.platform_id}-${i}`}
                    data-dropdown={true}
                    ref={buttonRef}
                    onClick={() => {
                      if (
                        platform?.brands.length > 0 &&
                        owner_platform.includes(platform.platform_id) &&
                        !checkisDisabled(
                          groupedData[platform.platform_id],
                          platform?.brands
                        )
                      )
                        toggleDropdown(`${platform.platform_id}-${i}`);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked(platform.brands)}
                      onClick={(e) => {
                        if (platform?.brands.length > 0)
                          handleBrandChange(platform.platform_id, null, true);
                        e.stopPropagation();
                      }}
                      disabled={
                        platform?.brands.length === 0 ||
                        !owner_platform.includes(platform.platform_id) ||
                        checkisDisabled(
                          groupedData[platform.platform_id],
                          platform?.brands
                        )
                      }
                      className={`mr-2  ${
                        platform?.brands.length > 0 &&
                        owner_platform.includes(platform.platform_id)
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                      data-dropdown={true}
                    />

                    <label
                      className={`text-sm font-medium text-[#000000] ${
                        platform?.brands.length > 0 &&
                        owner_platform.includes(platform.platform_id) &&
                        !checkisDisabled(
                          groupedData[platform.platform_id],
                          platform?.brands
                        )
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } overflow-hidden text-ellipsis whitespace-nowrap max-w-[80%] w-[80%]`}
                      data-dropdown={true}
                      onClick={() => {
                        if (
                          platform?.brands.length > 0 &&
                          owner_platform.includes(platform.platform_id) &&
                          !checkisDisabled(
                            groupedData[platform.platform_id],
                            platform?.brands
                          )
                        )
                          toggleDropdown(`${platform.platform_id}-${i}`);
                      }}
                    >
                      {getDisplayText(platform.brands)}
                    </label>
                    <img
                      className="w-3 h-4 ml-4"
                      src={
                        dropdown.open_id === `${platform.platform_id}-${i}` &&
                        platform.brands.length > 0
                          ? `/assets/images/flipkartactivedropdown.svg`
                          : `/assets/images/customDropDown.svg`
                      }
                      alt="toggle"
                    />
                    {dropdown.open_id === `${platform.platform_id}-${i}` &&
                      platform.brands.length > 0 && (
                        <div
                          className={`absolute ${
                            dropdown.position === "below"
                              ? "top-full mt-2"
                              : "bottom-full mb-2"
                          } z-10 w-[13rem] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
                          ref={dropdownRef}
                          data-dropdown={true}
                        >
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            data-dropdown={true}
                          >
                            {platform.brands.map((brand, index) => {
                              if (
                                groupedData[platform.platform_id].includes(
                                  brand.brand_id
                                )
                              )
                                // let findElement=owner_platform.
                                // console.log("brand>>>>>>>>>", owner_platform);
                                return (
                                  <div
                                    key={`${brand.brand_id}-${index}`}
                                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100`}
                                    style={{
                                      transition: "opacity 0.3s ease-in-out",
                                    }}
                                    data-dropdown={true}
                                    onClick={(e) => {
                                      handleBrandChange(
                                        platform.platform_id,
                                        brand.brand_id,
                                        false
                                      );
                                      e.stopPropagation();
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      id={`option-${brand.brand_id}-${index}`}
                                      checked={brand.selected}
                                      onChange={(e) => {
                                        handleBrandChange(
                                          platform.platform_id,
                                          brand.brand_id,
                                          false
                                        );
                                        e.stopPropagation();
                                      }}
                                      className="mr-2 cursor-pointer"
                                      data-dropdown={true}
                                    />
                                    <label
                                      // htmlFor={`option-${brand.brand_id}-${index}`}
                                      className="text-sm text-gray-700 cursor-pointer"
                                      data-dropdown={true}
                                      onClick={(e) => {
                                        handleBrandChange(
                                          platform.platform_id,
                                          brand.brand_id,
                                          false
                                        );
                                        e.stopPropagation();
                                      }}
                                    >
                                      {brand.brand_name}
                                    </label>
                                  </div>
                                );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                  {errors[platform.platform_id] && (
                    <p className="text-red-500 text-xs mb-2 invisible">
                      {errors[platform.platform_id]}
                    </p>
                  )}
                </>
              ))}
            </div>
          </div>
          {errors["platforms"] && (
            <p className="text-red-500 text-xs mb-2 ">{errors["platforms"]}</p>
          )}
        </div>
        {/* </div> */}
        <div className="flex justify-end p-6">
          <button
            type="button"
            className={`mr-2 bg-[#F8F8F8] text-[#5B5B5B] py-[6px] px-4 rounded-md border border-[#E3E3E3] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </button>
          <Button onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
          {/* <button
            type="submit"
            className="bg-blue-500 text-white py-[6px] px-4 rounded-md"
            disabled={loading}
            onClick={handleSubmit}
          >
            Submit
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
