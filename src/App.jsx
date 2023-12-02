// src/App.js

import React, { useState } from 'react';
import './App.css';
import userData from "./UserData";


const App = () => {
  const [users, setUsers] = useState([...userData].sort((a, b) => parseInt(a.id) - parseInt(b.id)));
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const usersPerPage = 10;

  // Function to filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get current users based on pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Function to handle checkbox selection
  const handleCheckboxChange = (id) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);
  };

  // Function to delete selected rows
  const deleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  // Function to handle pagination
  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    setCurrentPage(newPage);
  };

  // Function to handle editing user details
  const startEditing = (user) => {
    setEditingUser(user);
  };

  // Function to save edited user details
  const saveEdit = () => {
    setEditingUser(null);
  };

  return (
    <div>
      <div className="container">
        <div className="search-container">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setSearchQuery('')}>Clear</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedRows.length === currentUsers.length}
                  onChange={() => setSelectedRows(selectedRows.length === currentUsers.length ? [] : currentUsers.map(user => user.id))}
                />
                Select All
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>{user.role}</td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <button className="save" onClick={() => saveEdit()}>Save</button>
                  ) : (
                    <button className="edit" onClick={() => startEditing(user)}><i className="fa-solid fa-pen-to-square"></i></button>
                  )}
                  <button className="delete" onClick={() => setUsers(users.filter(u => u.id !== user.id))}><i className="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="actions">
          <button onClick={deleteSelected}>Delete Selected</button>
          <div className="pagination">
            <button onClick={() => handlePageChange('first')} disabled={currentPage === 1}>First</button>
            <button onClick={() => handlePageChange('previous')} disabled={currentPage === 1}>Previous</button>
            <span>{`Page ${currentPage}`}</span>
            <button onClick={() => handlePageChange('next')} disabled={indexOfLastUser >= filteredUsers.length}>Next</button>
            <button onClick={() => handlePageChange('last')} disabled={indexOfLastUser >= filteredUsers.length}>Last</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
