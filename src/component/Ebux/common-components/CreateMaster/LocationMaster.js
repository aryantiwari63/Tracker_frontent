import React from "react";
import { useForm } from "react-hook-form";

// Tailwind-based 6-column selector UI
export default function LocationMaster() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const countries = ["Afghanistan", "Bhutan", "China", "India", "Pakistan", "Sri Lanka", "Singapore", "South Korea", "Syria", "Thailand"];
  const regions = ["East", "West", "North", "South"];
  const states = ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana"];
  const cities = ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Dharwad"];
  const pincodes = ["560001", "560051", "560052", "560024", "560013", "560010", "560041"];

  return (
    <div className="w-full p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="border rounded-xl p-4 shadow-sm bg-white">
        <div className="grid grid-cols-6 gap-4">

          {/* Country */}
          <div className="border rounded-lg p-3 h-[500px] overflow-y-auto">
            <h2 className="font-semibold mb-2">1. Select Country</h2>
            <input type="text" placeholder="Search Country" className="w-full border px-2 py-1 rounded mb-2" />
            {countries.map((c) => (
              <label key={c} className="block py-1 cursor-pointer">
                <input type="radio" value={c} {...register("country", { required: true })} /> <span>{c}</span>
              </label>
            ))}
            {errors.country && <p className="text-red-500 text-sm">Country is required</p>}
          </div>

          {/* Region */}
          <div className="border rounded-lg p-3 h-[500px] overflow-y-auto">
            <h2 className="font-semibold mb-2">2. Select Region</h2>
            <input type="text" placeholder="Search Region" className="w-full border px-2 py-1 rounded mb-2" />
            {regions.map((r) => (
              <label key={r} className="block py-1 cursor-pointer">
                <input type="radio" value={r} {...register("region", { required: true })} /> <span>{r}</span>
              </label>
            ))}
            {errors.region && <p className="text-red-500 text-sm">Region is required</p>}
          </div>

          {/* State */}
          <div className="border rounded-lg p-3 h-[500px] overflow-y-auto">
            <h2 className="font-semibold mb-2">3. Select State</h2>
            <input type="text" placeholder="Search State" className="w-full border px-2 py-1 rounded mb-2" />
            {states.map((s) => (
              <label key={s} className="block py-1 cursor-pointer">
                <input type="radio" value={s} {...register("state", { required: true })} /> <span>{s}</span>
              </label>
            ))}
            {errors.state && <p className="text-red-500 text-sm">State is required</p>}
          </div>

          {/* City */}
          <div className="border rounded-lg p-3 h-[500px] overflow-y-auto">
            <h2 className="font-semibold mb-2">5. Select City</h2>
            <input type="text" placeholder="Search City" className="w-full border px-2 py-1 rounded mb-2" />
            {cities.map((ct) => (
              <label key={ct} className="block py-1 cursor-pointer">
                <input type="radio" value={ct} {...register("city", { required: true })} /> <span>{ct}</span>
              </label>
            ))}
            {errors.city && <p className="text-red-500 text-sm">City is required</p>}
          </div>

          {/* PIN Code */}
          <div className="border rounded-lg p-3 h-[500px] overflow-y-auto col-span-2">
            <h2 className="font-semibold mb-2">6. Select PIN Code</h2>
            <input type="text" placeholder="Search PIN Code" className="w-full border px-2 py-1 rounded mb-2" />
            {pincodes.map((p) => (
              <label key={p} className="block py-1 cursor-pointer">
                <input type="checkbox" value={p} {...register("pincode", { required: true })} /> <span>{p}</span>
              </label>
            ))}
            {errors.pincode && <p className="text-red-500 text-sm">Select at least one PIN code</p>}
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <button type="button" className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}