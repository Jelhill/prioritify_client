import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getNumberOfUsers, getAllTodos, getRecentUsers, getNumberOfAdmins } from 'api/api';
// Ensure getNumberOfAdmins is implemented in api.js

import avatar1 from '../../assets/images/user/avatar-1.jpg';

const DashDefault = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0); // New state for total admins
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all required dashboard data
        const [usersData, todosData, recentUsersData, adminsData] = await Promise.all([
          getNumberOfUsers(),
          getAllTodos(),
          getRecentUsers(),
          getNumberOfAdmins() // Fetch total admins
        ]);

        if (usersData.success) {
          setTotalUsers(usersData.data.count);
        }

        if (todosData.success) {
          setTotalTodos(todosData.data.length);
        }

        if (recentUsersData.success) {
          setRecentUsers(recentUsersData.data);
        }

        if (adminsData.success) {
          setTotalAdmins(adminsData.data.count);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardData = [
    {
      title: 'Total Registered Users',
      amount: totalUsers,
      icon: 'icon-user text-c-green',
      value: 100,
      class: 'progress-c-theme'
    },
    {
      title: 'Total Todos',
      amount: totalTodos,
      icon: 'icon-list text-c-blue',
      value: 100,
      class: 'progress-c-theme2'
    },
    {
      title: 'Total Registered Admin',
      amount: totalAdmins,
      icon: 'icon-user-check text-c-green',
      value: 100,
      class: 'progress-c-theme'
    }
  ];

  return (
    <React.Fragment>
      <Row>
        {loading ? (
          <Col>
            <div>Loading dashboard data...</div>
          </Col>
        ) : (
          dashboardData.map((data, index) => (
            <Col key={index} xl={6} xxl={4}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0">100%</p>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: '7px' }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value}%` }}
                      aria-valuenow={data.value}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}

        <Col md={6} xl={8}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">Recent Users</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              {loading ? (
                <div>Loading recent users...</div>
              ) : recentUsers.length === 0 ? (
                <div className="px-3 py-3">No recent users found.</div>
              ) : (
                <Table responsive hover className="recent-users">
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr className="unread" key={user._id}>
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                        </td>
                        <td>
                          <h6 className="mb-1">{user.full_name || `${user.firstname} ${user.lastname}`}</h6>
                          <p className="m-0">{user.email}</p>
                        </td>
                        <td>
                          <h6 className="text-muted">
                            <i className="fa fa-circle text-c-green f-10 m-r-15" />
                            {new Date(user.createdAt).toLocaleString()}
                          </h6>
                        </td>
                        <td>
                          <Link to="#" className="label theme-bg2 text-white f-12">
                            Reject
                          </Link>
                          <Link to="#" className="label theme-bg text-white f-12">
                            Approve
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* ... rest of your layout remains unchanged ... */}
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
