import React, { useState } from 'react';
import { Search, MoreVertical, Trash2, Edit, Eye, Plus, Filter, Download } from 'lucide-react';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNo: string;
  userType: string;
  status: 'Active' | 'Inactive';
}

const UsersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState<User[]>([
    {
      id: 'RAI0139',
      username: 'RAI0139',
      fullName: 'FALGUNIBEN PATEL',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919327294499',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0063',
      username: 'RAI0063',
      fullName: 'RASHILABEN PATEL',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919624972228',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0074',
      username: 'RAI0074',
      fullName: 'ARUNABEN PATEL',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919426067153',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0083',
      username: 'RAI0083',
      fullName: 'KANTIBHAI PATEL',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919408200195',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0101',
      username: 'RAI0101',
      fullName: 'MANSI SONI',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919428351101',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0177',
      username: 'RAI0177',
      fullName: 'DINESHKUMAR PATEL',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919428646309',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0369',
      username: 'RAI0369',
      fullName: 'CHHAYABEN POKAR',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919428646633',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0381',
      username: 'RAI0381',
      fullName: 'ISWARBHAI PATEL',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+919376132686',
      userType: 'Investor',
      status: 'Active'
    },
    {
      id: 'RAI0383',
      username: 'RAI0383',
      fullName: 'DIVYESHKUMAR PATEL',
      email: '1.dharmainfosystem@gmail.com',
      phoneNo: '+918238179393',
      userType: 'Investor',
      status: 'Active'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Users</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your user accounts and permissions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Filter size={18} />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl hover:from-cyan-600 hover:to-orange-600 transition-all shadow-md">
              <Plus size={18} />
              <span className="text-sm font-medium">Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-8 py-4 text-left">
                <input type="checkbox" className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone No
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-8 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{user.username}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-semibold">
                        {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{user.email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 font-mono">{user.phoneNo}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold bg-gradient-to-r from-cyan-100 to-orange-100 text-cyan-700 rounded-full">
                    {user.userType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 mt-0.5 ${
                      user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">1-{filteredUsers.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{users.length}</span> users
            </p>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
              Previous
            </button>
            <button className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-lg hover:from-cyan-600 hover:to-orange-600 transition-all shadow-md">
              1
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-gray-900">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;