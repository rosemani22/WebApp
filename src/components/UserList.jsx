import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
// import UserItem from './UserItem';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser , setEditingUser ] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser  = () => {
    setEditingUser (null);
    setShowForm(true);
  };

  const handleEditUser  = (user) => {
    setEditingUser (user);
    setShowForm(true);
  };

  const handleDeleteUser  = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSaveUser  = async (user) => {
    try {
      if (editingUser ) {
        // Edit existing user
        await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, user);
        setUsers(prevUsers => prevUsers.map(u => (u.id === editingUser.id ? user : u)));
      } else {
        // Add new user
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', user);
        setUsers(prevUsers => [...prevUsers, { ...response.data, id: prevUsers.length + 1 }]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  // Pagination logic
  const indexOfLastUser  = currentPage * usersPerPage;
  const indexOfFirstUser  = indexOfLastUser  - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser , indexOfLastUser );

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1>Web App</h1>
      <button onClick={handleAddUser}>Add Form</button>
      
      {showForm && (
        <UserForm user={editingUser} onSubmit={handleSaveUser} onCancel={handleCancel} />
      )}
      {/* <ul>
        {users.map(user => (
          <li key={user.id}>
            <UserItem user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
          </li>
        ))}
      </ul> */}
    

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.website}</td>
              <td>
                <button onClick={() => handleEditUser (user)}>Edit</button>
                <button onClick={() => handleDeleteUser (user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            onClick={() => handlePageChange(index + 1)} 
            disabled={currentPage === index + 1} // Disable button for the current page
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;