import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { getAllAdmins, updateAdmin, deleteUser } from 'api/api'; // Ensure API functions are properly defined

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdminData, setEditAdminData] = useState({ _id: '', firstname: '', lastname: '', email: '', adminType: '' });

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAllAdmins();
      if (data.success) {
        setAdmins(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch admins.');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setErrorMsg('Something went wrong while fetching admins.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (admin) => {
    setEditAdminData({
      _id: admin._id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      adminType: admin.adminType,
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const { _id, firstname, lastname, email, adminType } = editAdminData;
      const updatedData = { firstname, lastname, email, adminType };
      const response = await updateAdmin(_id, updatedData);
      if (response.success) {
        const updatedAdmins = admins.map((admin) => (admin._id === _id ? { ...admin, firstname, lastname, email, adminType } : admin));
        setAdmins(updatedAdmins);
        setShowEditModal(false);
      } else {
        alert(response.message || 'Failed to update admin.');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Something went wrong while updating the admin.');
    }
  };

  const handleDeleteClick = (adminId) => {
    setDeleteAdminId(adminId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteUser(deleteAdminId);
      if (response.success) {
        const updatedAdmins = admins.filter((admin) => admin._id !== deleteAdminId);
        setAdmins(updatedAdmins);
        setShowDeleteModal(false);
      } else {
        alert(response.message || 'Failed to delete admin.');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Something went wrong while deleting the admin.');
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">All Admins</Card.Title>
              <span className="d-block m-t-5">This table shows all registered admins fetched from the server.</span>
            </Card.Header>
            <Card.Body>
              {loading && <div>Loading admins...</div>}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              {!loading && !errorMsg && (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Admin Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, index) => (
                      <tr key={admin._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{admin._id}</td>
                        <td>{admin.firstname}</td>
                        <td>{admin.lastname}</td>
                        <td>{admin.email}</td>
                        <td>{admin.adminType}</td>
                        <td>
                          <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(admin)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteClick(admin._id)}>
                            Delete
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
          <Modal.Title>Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editAdminData.firstname}
                onChange={(e) => setEditAdminData({ ...editAdminData, firstname: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editAdminData.lastname}
                onChange={(e) => setEditAdminData({ ...editAdminData, lastname: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editAdminData.email}
                onChange={(e) => setEditAdminData({ ...editAdminData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Admin Type</Form.Label>
              <Form.Control
                as="select"
                value={editAdminData.adminType}
                onChange={(e) => setEditAdminData({ ...editAdminData, adminType: e.target.value })}
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="MODERATOR">Moderator</option>
              </Form.Control>
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
        <Modal.Body>Are you sure you want to delete this admin? This action cannot be undone.</Modal.Body>
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

export default AllAdmins;
