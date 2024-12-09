import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { adminLogin } from 'api/api';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await adminLogin({ email, password });
      if (data.success) {
        localStorage.setItem('admin_token', data.data.token);
        console.log('Login Success:', data);
        navigate('/dashboard');
      } else {
        setErrorMsg(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
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
                    <i className="feather icon-log-in auth-icon" />
                  </div>
                  <h3 className="mb-4">Login</h3>
                  {errorMsg && (
                    <div className="alert alert-danger" role="alert">
                      {errorMsg}
                    </div>
                  )}
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary mb-4" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <p className="mb-2">
                    Don’t have an account?{' '}
                    <NavLink to={'/auth/signup'} className="f-w-400">
                      Sign up
                    </NavLink>
                  </p>
                  {/* You can add a "Forgot Password" link here if needed */}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignIn;
