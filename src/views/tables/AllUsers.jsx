import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAllUsers, updateUser, deleteUser } from 'api/api'; // Ensure API functions are properly defined

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState({ _id: '', full_name: '', email: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAllUsers();
      if (data.success) {
        setUsers(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch users.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMsg('Something went wrong while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditUserData({ _id: user._id, full_name: user.full_name, email: user.email });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const { _id, full_name, email } = editUserData;
      const updatedData = { full_name, email };
      const response = await updateUser(_id, updatedData);
      if (response.success) {
        const updatedUsers = users.map((u) => (u._id === _id ? { ...u, full_name, email } : u));
        setUsers(updatedUsers);
        setShowEditModal(false);
      } else {
        alert(response.message || 'Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Something went wrong while updating the user.');
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteUser(deleteUserId);
      if (response.success) {
        const updatedUsers = users.filter((u) => u._id !== deleteUserId);
        setUsers(updatedUsers);
        setShowDeleteModal(false);
      } else {
        alert(response.message || 'Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Something went wrong while deleting the user.');
    }
  };

  const handleViewTodos = (userId) => {
    navigate(`/user-todos/${userId}`); // Redirect to ViewTodos page with the user ID
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">All Users</Card.Title>
              <span className="d-block m-t-5">This table shows all registered users fetched from the server.</span>
            </Card.Header>
            <Card.Body>
              {loading && <div>Loading users...</div>}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              {!loading && !errorMsg && (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{user._id}</td>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(user)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteClick(user._id)}>
                            Delete
                          </Button>
                          <Button variant="info" size="sm" onClick={() => handleViewTodos(user._id)}>
                            View Todos
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={editUserData.full_name}
                onChange={(e) => setEditUserData({ ...editUserData, full_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default AllUsers;
