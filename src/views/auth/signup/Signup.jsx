import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { adminSignup } from 'api/api';

const Signup = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminType, setAdminType] = useState('SUPER_ADMIN');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await adminSignup({ firstname, lastname, email, username, password, adminType });
      if (data.success) {
        localStorage.setItem('admin_token', data.data.token);
        navigate('/admin/auth/signin');
      } else {
        setErrorMsg(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      setErrorMsg('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  {errorMsg && (
                    <div className="alert alert-danger" role="alert">
                      {errorMsg}
                    </div>
                  )}
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <select className="form-control" value={adminType} onChange={(e) => setAdminType(e.target.value)}>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MODERATOR">MODERATOR</option>
                    </select>
                  </div>
                  <button className="btn btn-primary mb-4" onClick={handleSignup} disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign up'}
                  </button>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to={'/auth/signin'} className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signup;
