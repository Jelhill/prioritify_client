import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ChatList from './ChatList';

import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [adminName, setAdminName] = useState(''); // State for the logged-in admin's name
  const navigate = useNavigate();

  // Notifications data
  const notiData = [
    {
      name: 'Joseph William',
      image: avatar2,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'Currently logged in',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: 'Yesterday'
    }
  ];

  // Fetch logged-in admin's name on mount
  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('admin_data'));
    if (adminData && adminData.firstname && adminData.lastname) {
      setAdminName(`${adminData.firstname} ${adminData.lastname}`);
    } else {
      setAdminName('Admin');
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token'); // Clear token
    localStorage.removeItem('admin_data'); // Clear admin data
    navigate('/login'); // Redirect to login page
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link to="#" className="me-2">
                    Mark as read
                  </Link>
                  <Link to="#">Clear all</Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                  {notiData.map((data, index) => (
                    <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                      <Card
                        className="d-flex align-items-center shadow-none mb-0 p-0"
                        style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                      >
                        <img className="img-radius" src={data.image} alt="Notification" />
                        <Card.Body className="p-0">
                          <p>
                            <strong>{data.name}</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock me-2" />
                              {data.activity}
                            </span>
                          </p>
                          <p>{data.details}</p>
                        </Card.Body>
                      </Card>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="#">Show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>{adminName}</span> {/* Display admin name */}
                <button className="dud-logout" title="Logout" onClick={handleLogout}>
                  <i className="feather icon-log-out" />
                </button>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="feather icon-lock" /> Log out
                  </button>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
