import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3001/studentaccount')
      .then(response => {
        setData(response.data);
        setError('');
      })
      .catch(error => setError('Error fetching data: ' + error.message));
  };

  const handleEdit = (id, username, password) => {
    setEditId(id);
    setEditUsername(username);
    setEditPassword(password);
  };

  const handleSave = () => {
    if (!editUsername || !editPassword) {
      setError('Username and Password cannot be empty.');
      return;
    }

    axios.put(`http://localhost:3001/studentaccount/${editId}`, { username: editUsername, password: editPassword })
      .then(response => {
        const updatedData = data.map(item => (item.id === editId ? response.data : item));
        setData(updatedData);
        setEditId(null);
        setEditUsername('');
        setEditPassword('');
        setError('');
      })
      .catch(error => setError('Error updating data: ' + error.message));
  };

  const handleDeleteConfirm = () => {
    axios.delete(`http://localhost:3001/studentaccount/${deleteId}`)
      .then(() => {
        const updatedData = data.filter(item => item.id !== deleteId);
        setData(updatedData);
        setDeleteId(null);
        setError('');
      })
      .catch(error => setError('Error deleting data: ' + error.message));
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleAddSubmit = () => {
    if (!newUsername || !newPassword) {
      setError('Username and Password cannot be empty.');
      return;
    }

    axios.post('http://localhost:3001/studentaccount', { username: newUsername, password: newPassword })
      .then(() => {
        fetchData(); // Fetch updated data after adding
        setNewUsername('');
        setNewPassword('');
        setShowAddForm(false);
        setError('');
      })
      .catch(error => setError('Error adding data: ' + error.message));
  };

  return (
    <div className="table-container">
      <h2>Student Accounts</h2>
      <button className="add-btn" onClick={handleAdd}>Add Student</button>
      {showAddForm && (
        <div>
          <input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button className="submit-btn" onClick={handleAddSubmit}>Submit</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{editId === row.id ? <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} /> : row.username}</td>
              <td>{editId === row.id ? <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} /> : row.password}</td>
              <td>
                {editId === row.id ? (
                  <>
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={() => { setEditId(null); setEditUsername(''); setEditPassword(''); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(row.id, row.username, row.password)}>Edit</button>
                    <button className="delete-btn" onClick={() => setDeleteId(row.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {deleteId && (
        <div className="delete-modal">
          <p>Are you sure you want to delete this student account?</p>
          <button className="confirm-btn" onClick={handleDeleteConfirm}>Yes</button>
          <button className="cancel-btn" onClick={() => setDeleteId(null)}>No</button>
        </div>
      )}
    </div>
  );
}

export default Home;
