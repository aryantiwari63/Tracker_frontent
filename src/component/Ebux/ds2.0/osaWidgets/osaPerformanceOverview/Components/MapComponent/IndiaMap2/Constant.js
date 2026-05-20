export const stateRegionMap = {
  "Jammu and Kashmir": "North",
  "Ladakh": "North",
  "Punjab": "North",
  "Haryana": "North",
  "Uttar Pradesh": "North",
  "Himachal Pradesh": "North",
  "Uttarakhand": "North",
  "Uttaranchal": "North",
  "Delhi": "North",
  "Bihar": "North",
  "Kerala": "South",
  "Karnataka": "South",
  "Tamil Nadu": "South",
  "Telangana": "South",
  "Andhra Pradesh": "South",
  "West Bengal": "East",
  "Odisha": "East",
  "Jharkhand": "East",
  "Assam": "East",
  "Sikkim": "East",
  "Chhattisgarh": "East",
  "Orissa": "East",
  "Mizoram": "East",
  "Arunachal Pradesh": "East",
  "Meghalaya": "East",
  "Tripura": "East",
  "Manipur": "East",
  "Nagaland": "East",
  "Rajasthan": "West",
  "Gujarat": "West",
  "Maharashtra": "West",
  "Goa": "West",
  "Madhya Pradesh": "West",
  "Dadra and Nagar Haveli and Daman and Diu": "West"
};

// export const stateLabelCoordinates = {
//   "Delhi": [28.6139, 77.2090],
//   "Haryana": [29.0588, 76.0856],
//   "Punjab": [31.1471, 75.3412],
//   "Uttarakhand": [30.0668, 79.0193],
//   "Uttar Pradesh": [26.8467, 80.9462],
//   "Bihar": [25.0961, 85.3131],
//   "Himachal Pradesh": [31.1048, 77.1734],
//   "Jammu and Kashmir": [33.7782, 76.5762],
//   "Ladakh": [34.1526, 77.5770],

// };

export const stateLabelCoordinates = {
  "Andhra Pradesh": [16.5417, 80.5176],
  "Arunachal Pradesh": [27.1020, 93.6920],
  "Assam": [26.1433, 91.7898],
  "Bihar": [25.0961, 85.3131],
  "Chhattisgarh": [21.2514, 81.6296],
  "Goa": [15.4909, 73.8278],
  "Gujarat": [23.2156, 72.6369],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jharkhand": [23.3441, 85.3096],
  "Karnataka": [12.9716, 77.5946],
  "Kerala": [8.5241, 76.9366],
  "Madhya Pradesh": [23.2599, 77.4126],
  "Maharashtra": [19.0760, 72.8777],
  "Manipur": [24.8170, 93.9368],
  "Meghalaya": [25.5788, 91.8933],
  "Mizoram": [23.7271, 92.7176],
  "Nagaland": [25.6701, 94.1077],
  "Odisha": [20.2961, 85.8245],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [26.9124, 75.7873],
  "Sikkim": [27.3314, 88.6138],
  "Tamil Nadu": [13.0827, 80.2707],
  "Telangana": [17.3850, 78.4867],
  "Tripura": [23.8315, 91.2868],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.5726, 88.3639],
  "Andaman and Nicobar": [11.6234, 92.7265],
  "Chandigarh": [30.7333, 76.7794],
  "Dadra and Nagar Haveli and Daman and Diu": [20.3974, 72.8328],
  "Delhi": [28.6139, 77.2090],
  "Jammu and Kashmir": [34.0837, 74.7973],
  "Ladakh": [34.1526, 77.5770],
  "Lakshadweep": [10.5667, 72.6417],
  "Puducherry": [11.9416, 79.8083]
};



// Cities Data (Sample)
export const citiesData = [
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "HR-NCR", state: "Haryana", lat: 28.4595, lng: 77.0266 }, // Gurgaon as reference
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "UP-NCR", state: "Uttar Pradesh", lat: 28.6692, lng: 77.4538 }, // Ghaziabad as reference
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Delhi", state: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  // Add more as needed!
];

export const regionColors = {
  North: "#7997F2",
  South: "#50B271",
  East: "#F2D63D",
  West: "#FF6859",
  Default: "gray",
  Selected: "#FA8C16",
};

export const viewConfigMap = {
  // india: { center: [22.9734, 78.6569], zoom: 5,maxBounds:[[6, 68], [38, 98]] },
  // Delhi: { center: [28.6139, 77.2090], zoom: 10.2,maxBounds:[[28.4, 76.8], [28.9, 77.5]] },
  // Jaipur: { center: [26.9124, 75.7873], zoom: 11.5,maxBounds:[[26.5, 75.5], [27.3, 76.1]]},
  // Lucknow: { center: [26.8467, 80.9462], zoom: 11.5,maxBounds:[[26.5, 80.5], [27.2, 81.1]] },
  // Mumbai: { center: [19.0760, 72.8777], zoom: 11 },
  // Pune: { center: [19.0760, 72.8777], zoom: 11 },
  india: {
    center: [22.9734, 78.6569],
    zoom: 5,
    maxBounds: [[6, 68], [38, 98]]
  },
  Delhi: {
    center: [28.6139, 77.2090],
    zoom: 10.2,
    maxBounds: [[28.4, 76.8], [28.9, 77.5]]
  },
  Jaipur: {
    center: [26.9124, 75.7873],
    zoom: 11.5,
    maxBounds: [[26.5, 75.5], [27.3, 76.1]]
  },
  Lucknow: {
    center: [26.8467, 80.9462],
    zoom: 11.5,
    maxBounds: [[26.5, 80.5], [27.2, 81.1]]
  },
  Mumbai: {
    center: [19.0760, 72.8777],
    zoom: 11.2,
    maxBounds: [[18.85, 72.70], [19.30, 73.05]]
  },
  Pune: {
    center: [18.5204, 73.8567],
    zoom: 11.2,
    maxBounds: [[18.4, 73.7], [18.7, 74.1]]
  },
  Kolkata: {
    center: [22.5726, 88.3639],
    zoom: 11.5,
    maxBounds: [[22.4, 88.2], [22.8, 88.5]]
  },
  Bangalore: {
    center: [12.9716, 77.5946],
    zoom: 11,
    maxBounds: [[12.8, 77.4], [13.2, 77.8]]
  },
  Chennai: {
    center: [13.0827, 80.2707],
    zoom: 11,
    maxBounds: [[12.9, 80.0], [13.3, 80.4]]
  },
  "HR-NCR":{
    center: [28.4595, 77.0266],
    zoom: 10,
    maxBounds: [[28.3, 76.9], [28.7, 77.2]]
  },
  "UP-NCR": {
    center: [28.6465, 77.4563], 
    zoom: 10,
    maxBounds: [
      [28.5, 77.2], 
      [28.8, 77.65] 
    ]
  } 
  ,
  "Noida": {
  center: [28.5672, 77.3210], 
  zoom: 10,
  maxBounds: [
    [28.50, 77.25], 
    [28.62, 77.40]  
  ]
},
Hyderabad: {
  center: [17.3850, 78.4867],
  zoom: 11,
  maxBounds: [
    [17.30, 78.40],
    [17.45, 78.55] 
  ]
}
  // ...
};