import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access the user ID from the route
import { Row, Col, Card, Table } from 'react-bootstrap';
import { getAllTodosByUser, getUserById } from 'api/api'; // Ensure these API functions are defined

const UserTodos = () => {
  const { id } = useParams(); // Get user ID from the route
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null); // State to hold user details
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchUserDetailsAndTodos();
  }, [id]);

  const fetchUserDetailsAndTodos = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Fetch user details
      const userData = await getUserById(id);
      if (userData.success) {
        setUser(userData.data);
      } else {
        setErrorMsg(userData.message || 'Failed to fetch user details.');
      }

      // Fetch todos for the user
      const todosData = await getAllTodosByUser(id);
      if (todosData.success) {
        setTodos(todosData.data);
      } else {
        setErrorMsg(todosData.message || 'Failed to fetch todos.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMsg('Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">All Todos</Card.Title>
              <br />
              <br />
              <Card.Title as="h5">{user ? `${user.full_name}` : 'Todos for User'}</Card.Title>
              <span className="d-block m-t-5">This table lists all todos for the selected user.</span>
            </Card.Header>
            <Card.Body>
              {loading && <div>Loading todos...</div>}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              {!loading && !errorMsg && (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                  {console.log(todos)}
                    {todos.map((todo, index) => (
                      <tr key={todo._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{todo._id}</td>
                        <td>{todo.title}</td>
                        <td>{todo.description}</td>
                        <td>{todo.priority}</td>
                        <td>{todo.status}</td>
                        <td>{new Date(todo.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default UserTodos;
