// import React, { useState } from 'react';
// // Import FontAwesome components and specific icons
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faMagnifyingGlass, 
//   faChartSimple, 
//   faChevronLeft, 
//   faChevronRight 
// } from '@fortawesome/free-solid-svg-icons';

// const MOCK_USERS = [
//   { id: 1, name: 'Alex Morgan', email: 'alex.m@example.com' },
//   { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
//   { id: 3, name: 'Michael Chen', email: 'm.chen@example.com' },
//   { id: 4, name: 'Emily Rodriguez', email: 'emily.r@example.com' },
//   { id: 5, name: 'David Kim', email: 'd.kim@example.com' },
//   { id: 6, name: 'Jessica Taylor', email: 'jess.t@example.com' },
//   { id: 7, name: 'James Wilson', email: 'james.w@example.com' },
//   { id: 8, name: 'Amanda Martinez', email: 'amanda.m@example.com' },
//   { id: 9, name: 'Robert Thomas', email: 'robert.t@example.com' },
//   { id: 10, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
//   { id: 11, name: 'William Garcia', email: 'will.g@example.com' },
//   { id: 12, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  
//   { id: 13, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
//   { id: 14, name: 'William Garcia', email: 'will.g@example.com' },
//   { id: 15, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  
//   { id: 16, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
//   { id: 17, name: 'William Garcia', email: 'will.g@example.com' },
//   { id: 18, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  
//   { id: 19, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
//   { id: 20, name: 'William Garcia', email: 'will.g@example.com' },
//   { id: 21, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  
//   { id: 22, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
//   { id: 23, name: 'William Garcia', email: 'will.g@example.com' },
//   { id: 24, name: 'Ashley Flores', email: 'ashley.f@example.com' },
// ];

// function UserList() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 10;

//   // 1. Filter Logic
//   const filteredUsers = MOCK_USERS.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // 2. Pagination Logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); 
//   };

//   const handleAnalysisClick = (userName) => {
//     alert(`Opening analysis for ${userName}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//         {/* max-w-4xl mx-auto */}
//         <div className="p-6 bg-white border-b border-gray-100 sm:flex sm:items-center sm:justify-between">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">User List</h2>
//           </div>
          
//           {/* Search Input Container */}
//           <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm max-w-xs w-full">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            
//               <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Search by name or email..."
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             />
//           </div>
//         </div>

//         {/* Users List */}
//         <div className="divide-y divide-gray-100">
//           {currentUsers.length > 0 ? (
//             currentUsers.map((user) => (
//               <div 
//                 key={user.id} 
//                 className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors sm:px-6"
//               >
//                 <div className="flex flex-col pr-4">
//                   <span className="text-sm font-semibold text-gray-900 sm:text-base">{user.name}</span>
//                   <span className="text-xs text-gray-500 sm:text-sm truncate max-w-[200px] sm:max-w-md">
//                     {user.email}
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => handleAnalysisClick(user.name)}
//                   className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors group "
//                   title="View Analysis"
//                 >
//                   <FontAwesomeIcon icon={faChartSimple} className="h-5 w-5 group-hover:scale-105 transition-transform" />
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-12 text-gray-500 text-sm">
//               No users found
//             </div>
//           )}
//         </div>

//         {/* Pagination Footer */}
//         {totalPages > 1 && (
//           <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-100 sm:px-6">
            
//             {/* <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 Next
//               </button>
//             </div> */}

//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(indexOfLastUser, filteredUsers.length)}
//                   </span>{' '}
//                   of <span className="font-medium">{filteredUsers.length}</span> results
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
//                   >
//                     <span className="sr-only">Previous</span>
//                     {/* FontAwesome Chevron Left */}
//                     <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
//                   </button>

//                   {[...Array(totalPages)].map((_, index) => {
//                     const pageNum = index + 1;
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}

//                   <button
//                     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : ''}`}
//                   >
//                     <span className="sr-only">Next</span>
//                     {/* FontAwesome Chevron Right */}
//                     <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
//                   </button>
//                 </nav>
//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserList;
import React, { useEffect, useState } from 'react';
// Import FontAwesome components and specific icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagnifyingGlass, 
  faChartSimple, 
  faChevronLeft, 
  faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import { _GETWIthToken } from '../../services/axios.method';
import { IDENTITY_MODULE_BASE_URL } from '../../utils/url';

const MOCK_USERS = [
 { id: 1, name: 'Alex Morgan', email: 'alex.m@example.com' },
  { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@example.com' },
  { id: 4, name: 'Emily Rodriguez', email: 'emily.r@example.com' },
  { id: 5, name: 'David Kim', email: 'd.kim@example.com' },
  { id: 6, name: 'Jessica Taylor', email: 'jess.t@example.com' },
  { id: 7, name: 'James Wilson', email: 'james.w@example.com' },
  { id: 8, name: 'Amanda Martinez', email: 'amanda.m@example.com' },
  { id: 9, name: 'Robert Thomas', email: 'robert.t@example.com' },
  { id: 10, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
  { id: 11, name: 'William Garcia', email: 'will.g@example.com' },
  { id: 12, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  { id: 13, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
  { id: 14, name: 'William Garcia', email: 'will.g@example.com' },
  { id: 15, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  { id: 16, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
  { id: 17, name: 'William Garcia', email: 'will.g@example.com' },
  { id: 18, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  { id: 19, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
  { id: 20, name: 'William Garcia', email: 'will.g@example.com' },
  { id: 21, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  { id: 22, name: 'Lisa Anderson', email: 'lisa.a@example.com' },
  { id: 23, name: 'William Garcia', email: 'will.g@example.com' },
  { id: 24, name: 'Ashley Flores', email: 'ashley.f@example.com' },
  { id: 25, name: 'Brian O\'Conner', email: 'brian.o@example.com' },
  { id: 26, name: 'Mia Toretto', email: 'mia.t@example.com' },
  { id: 27, name: 'Dominic Toretto', email: 'dom.t@example.com' },
  { id: 28, name: 'Letty Ortiz', email: 'letty.o@example.com' },
  { id: 29, name: 'Roman Pearce', email: 'roman.p@example.com' },
  { id: 30, name: 'Tej Parker', email: 'tej.p@example.com' },
  { id: 31, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 32, name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 33, name: 'Oliver Twist', email: 'oliver.t@example.com' },
  { id: 34, name: 'Harry Potter', email: 'harry.p@example.com' },
  { id: 35, name: 'Bruce Wayne', email: 'bruce.w@example.com' },
  { id: 36, name: 'Clark Kent', email: 'clark.k@example.com' },
  { id: 37, name: 'Diana Prince', email: 'diana.p@example.com' },
  { id: 38, name: 'Peter Parker', email: 'peter.p@example.com' },
  { id: 39, name: 'Tony Stark', email: 'tony.s@example.com' },
  { id: 40, name: 'Steve Rogers', email: 'steve.r@example.com' },
  { id: 41, name: 'Natasha Romanoff', email: 'natasha.r@example.com' },
  { id: 42, name: 'Bruce Banner', email: 'bruce.b@example.com' },
  { id: 43, name: 'Wanda Maximoff', email: 'wanda.m@example.com' },
  { id: 44, name: 'Vision Jarvis', email: 'vision.j@example.com' },
  { id: 45, name: 'Sam Wilson', email: 'sam.w@example.com' },
  { id: 46, name: 'Bucky Barnes', email: 'bucky.b@example.com' },
  { id: 47, name: 'Scott Lang', email: 'scott.l@example.com' },
  { id: 48, name: 'Hope Van Dyne', email: 'hope.v@example.com' },
  { id: 49, name: 'T\'Challa Udaku', email: 'tchalla.u@example.com' },
  { id: 50, name: 'Carol Danvers', email: 'carol.d@example.com' },
  { id: 51, name: 'Thor Odinson', email: 'thor.o@example.com' },
  { id: 52, name: 'Loki Laufeyson', email: 'loki.l@example.com' },
  { id: 53, name: 'Arthur Curry', email: 'arthur.c@example.com' },
  { id: 54, name: 'Barry Allen', email: 'barry.a@example.com' },
  { id: 55, name: 'Hal Jordan', email: 'hal.j@example.com' },
  { id: 56, name: 'Victor Stone', email: 'victor.s@example.com' },
  { id: 57, name: 'Oliver Queen', email: 'oliver.q@example.com' },
  { id: 58, name: 'Felicity Smoak', email: 'felicity.s@example.com' },
  { id: 59, name: 'John Diggle', email: 'john.d@example.com' },
  { id: 60, name: 'Sara Lance', email: 'sara.l@example.com' },
  { id: 61, name: 'Ray Palmer', email: 'ray.p@example.com' },
  { id: 62, name: 'Mick Rory', email: 'mick.r@example.com' },
  { id: 63, name: 'Leonard Snart', email: 'leonard.s@example.com' },
  { id: 64, name: 'Iris West', email: 'iris.w@example.com' },
  { id: 65, name: 'Caitlin Snow', email: 'caitlin.s@example.com' },
  { id: 66, name: 'Cisco Ramon', email: 'cisco.r@example.com' },
  { id: 67, name: 'Harrison Wells', email: 'harrison.w@example.com' },
  { id: 68, name: 'Joe West', email: 'joe.w@example.com' },
  { id: 69, name: 'David Singh', email: 'david.s@example.com' },
  { id: 70, name: 'Cecile Horton', email: 'cecile.h@example.com' },
  { id: 71, name: 'Allegra Garcia', email: 'allegra.g@example.com' },
  { id: 72, name: 'Chester Runk', email: 'chester.r@example.com' }
];

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const usersPerPage = 10;

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const visiblePageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePageNumbers.push(i);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  
  const getAllUsers = async () => {
  try {
    // const client_id = localStorage.getItem("client_id");
   
const url = `${IDENTITY_MODULE_BASE_URL}/user/getUserListNew`;
const res =await _GETWIthToken(url);
console.log("ll",res);
  } catch (error) {
    console.log(error);

    setUsers([]);

    // if (error?.response?.status === 401) {
    //   Cookies.remove("accessToken");
    //   window.location.href = "/login";
    // }
  }
};

useEffect(() => {
  getAllUsers();
}, []);

console.group(users);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        
        <div className="p-6 bg-white border-b border-gray-100 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">User List</h2>
          </div>
          
          <div className="mt-4 sm:mt-0 relative rounded-md shadow-sm max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors sm:px-6"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">{user.name}</span>
                  <span className="text-xs text-gray-500 sm:text-sm truncate max-w-[200px] sm:max-w-md">
                    {user.email}
                  </span>
                </div>

                <button
                 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors group "
                  title="View Analysis"
                >
                  <FontAwesomeIcon icon={faChartSimple} className="h-5 w-5 group-hover:scale-105 transition-transform" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">
              No users found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-100 sm:px-6">
            
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
             
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">Previous</span>
                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                  </button>

                  {visiblePageNumbers.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">Next</span>
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;