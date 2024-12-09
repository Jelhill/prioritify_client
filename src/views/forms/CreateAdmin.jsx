import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { adminSignup } from 'api/api'; // Adjust if needed

const CreateAdmin = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password'); // Default password
  const [adminType, setAdminType] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [checkMeOut, setCheckMeOut] = useState(false); // For the checkbox

  useEffect(() => {
    const generatedUsername = (firstname + lastname).replace(/\s+/g, '').toLowerCase();
    setUsername(generatedUsername);
  }, [firstname, lastname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!firstname || !lastname || !email || !username || !password || !adminType) {
      setErrorMsg('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const data = await adminSignup({ firstname, lastname, email, username, password, adminType });
      if (data.success) {
        setSuccessMsg('Admin created successfully!');
        // Reset fields if desired
        setFirstname('');
        setLastname('');
        setEmail('');
        setPassword('password');
        setAdminType('ADMIN');
        setCheckMeOut(false);
      } else {
        setErrorMsg(data.message || 'Failed to create admin. Please try again.');
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
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Create Admin</Card.Title>
            </Card.Header>
            <Card.Body>
              {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
              {successMsg && <Alert variant="success">{successMsg}</Alert>}

              <Row>
                <Col md={6}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formFirstname">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      <Form.Text className="text-muted">We&apos;ll never share your email with anyone else.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check
                        type="checkbox"
                        label="Check me out"
                        checked={checkMeOut}
                        onChange={(e) => setCheckMeOut(e.target.checked)}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Submit'}
                    </Button>
                  </Form>
                </Col>

                <Col md={6}>
                <Form.Group className="mb-3" controlId="formLastname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Auto-generated username" value={username} readOnly />
                    <Form.Text className="text-muted">Generated from the first and last name.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formAdminType">
                    <Form.Label>Admin Type</Form.Label>
                    <Form.Control as="select" value={adminType} onChange={(e) => setAdminType(e.target.value)}>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MODERATOR">MODERATOR</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CreateAdmin;
