
import React, { useEffect, useRef, useState } from 'react';
// Import FontAwesome components and specific icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagnifyingGlass, 
  faChevronLeft, 
  faChevronRight,
  faChevronDown,
  faChevronRight as faChevronSide 
} from '@fortawesome/free-solid-svg-icons';
import { _GETWIthToken } from '../../services/axios.method';
import { IDENTITY_MODULE_BASE_URL } from '../../utils/url';

function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
 const client_id = localStorage.getItem("client_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null); 
  const usersPerPage = 10;

  const expandedRef = useRef(null);

  const filteredUsers = users.filter((user) =>
    `${user.firstName || ""} ${user.lastName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
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
    setExpandedUserId(null); 
  };

  const toggleRow = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null); 
    } else {
      setExpandedUserId(userId); 
    }
  };

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const url = `${IDENTITY_MODULE_BASE_URL}/user/getUserListNew`;
      const res = await _GETWIthToken(url);
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
      setUsers([]);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [client_id]);

  useEffect(() => {
  setExpandedUserId(null);
}, [currentPage]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      expandedRef.current &&
      !expandedRef.current.contains(event.target)
    ) {
      setExpandedUserId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

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
              placeholder="Search by name, email"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 uppercase font-semibold text-gray-600 tracking-wider">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Department</th>
                 <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
        {loading ? (
  <tr>
    <td colSpan="5" className="text-center py-12">
      Loading users...
    </td>
  </tr>
) :      currentUsers.length > 0 ? (
                currentUsers.map((user) => {
                  const isExpanded = expandedUserId === user.id;
                  return (
                    <React.Fragment key={user.id}>
                      
                      <tr className="hover:bg-gray-50 transition-colors text-[15px]">
                        <td className="p-4 text-center">
                          <button 
                            //onClick={() => toggleRow(user.id)}
                             onClick={(e) => {
    e.stopPropagation();
    toggleRow(user.id);
  }}
                            className="text-gray-500 hover:text-gray-900 focus:outline-none p-1"
                          >
                            <FontAwesomeIcon 
                              icon={isExpanded ? faChevronDown : faChevronSide} 
                              className="h-4 w-4 transition-transform duration-200"
                            />
                          </button>
                        </td>
                        <td className="p-4  text-gray-600">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="p-4 text-gray-600">
                          {user.email || 'N/A'}
                        </td>
                        <td className="p-4 text-gray-600">
                          {user.department || 'N/A'} 
                        </td>
                        <td className="p-4 text-gray-600">
                              view
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-gray-50/50">
                          <td colSpan="5" className="py-2 px-6 border-t border-b border-gray-200/60">
                            <div   ref={expandedRef}  onClick={(e) => e.stopPropagation()}
 className="w-full bg-white rounded-lg p-5 border border-gray-200 shadow-sm font-mono text-xs text-gray-800 space-y-4">
                              <div>
                                <div className="font-bold text-sm text-gray-900 border-b pb-1 mb-2">
                                  {user.firstName} {user.lastName}
                                </div>
                                <p className="leading-relaxed"><strong>Current Screen:</strong> Orders Dashboard</p>
                                <p className="leading-relaxed"><strong>Current IP:</strong> 192.168.x.x</p>
                                <p className="leading-relaxed"><strong>Browser:</strong> Chrome / Windows</p>
                                <p className="leading-relaxed"><strong>Session Duration:</strong> 1h 22m</p>
                              </div>

                              <div className="border-t pt-3">
                                <div className="font-bold text-gray-900 mb-2 tracking-wide uppercase text-[10px]">
                                  Activity Timeline
                                </div>
                                <div className="space-y-1.5 text-gray-600">
                                  <p><span className="text-gray-400 mr-2">10:21</span> Login</p>
                                  <p><span className="text-gray-400 mr-2">10:23</span> Opened Dashboard</p>
                                  <p><span className="text-gray-400 mr-2">10:25</span> Viewed Orders</p>
                                  <p><span className="text-gray-400 mr-2">10:31</span> Edited Product</p>
                                  <p><span className="text-gray-400 mr-2">10:45</span> Logged Out</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500 text-sm">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-4 flex items-center justify-end border-t border-gray-100 sm:px-6">
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
        )}
      </div>
    </div>
  );
}

export default UserList;