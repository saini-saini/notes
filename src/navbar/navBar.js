import React, { useEffect, useState } from 'react';
import './navBar.css';
import { Button, Badge, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseFireStore/config';
import { signOut } from 'firebase/auth';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { dataBase } from '../firebaseFireStore/config';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MenuIcon from '@mui/icons-material/Menu';
import EditNoteIcon from '@mui/icons-material/EditNote';
import KeyIcon from '@mui/icons-material/Key';
import { eventEmitter } from '../utils/eventEmitter';

const NavBar = ({ userName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [allRead, setAllRead] = useState(false);
  const user = auth.currentUser;
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const toggleNotificationDrawer = () => {
    setNotificationOpen(!notificationOpen);
  };

  const fetchNotifications = async () => {
    if (user) {
      const notesCollection = collection(dataBase, 'notes');
      const notesQuery = query(notesCollection, where('email', '==', user.email));
      const notesSnapshot = await getDocs(notesQuery);
      const notesList = notesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));
      const todayNotifications = notesList.filter(note => {
        const noteDate = new Date(note.date.seconds * 1000);
        return noteDate >= todayStart && noteDate <= todayEnd;
      });
      setNotifications(todayNotifications);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 769);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, isRead: true }));
    setNotifications(updatedNotifications);
    setAllRead(true);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const NotificationDrawer = (
    <Drawer anchor="right" open={notificationOpen} onClose={toggleNotificationDrawer}>
      <List>
        <Button onClick={markAllAsRead}>Mark all as read</Button>
        <Divider ></Divider>
        {notifications.map((notification, index) => (
          <ListItem button key={index} style={{ backgroundColor: allRead || notification.isRead ? 'white' : '#cbe0f3f8' }}>
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ListItemText primary={notification.title} secondary={notification.description} />
              <Button
                variant='outlined'
                style={{ width: '150px' }}
                onClick={() => markAsRead(notification.id)}
              >
                Mark as read
              </Button>
              <Divider style={{ marginTop: '20px' }}></Divider>
            </div>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  return (
    <div className='navBarContainer'>
      {isMobileView && <MenuIcon onClick={toggleLeftDrawer} style={{ marginLeft: '30px' }} />}

      {isMobileView && (
        <Drawer anchor="left" open={leftDrawerOpen} onClose={toggleLeftDrawer}>
          <List>
            <li button onClick={() => navigate('/home')} className={`sideBarButton ${location.pathname === '/home' ? 'sideBarButtonActive' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
            <EditNoteIcon/>  <ListItemText  primary="Notes" />
              </div>
            </li>
            <li button onClick={() => navigate('/home/password')} className={`sideBarButton ${location.pathname === '/home/password' ? 'sideBarButtonActive' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
             <KeyIcon/> <ListItemText primary="Password" />
             </div>
            </li>
            <li className='sideBarButton'>
            <Button variant='contained' style={{ color: "white" }} onClick={handleLogOut}>Logout</Button>
            </li>

          </List>
        </Drawer>
      )}

      {!isMobileView && (
        <div className='navBarLeft'>
          <li className={`navButton ${location.pathname === '/home' ? 'active' : ''}`} onClick={() => navigate('/home')}>Notes</li>
          <li className={`navButton ${location.pathname === '/home/password' ? 'active' : ''}`} onClick={() => navigate('/home/password')}>Password</li>
        </div>
      )}

      <div className='navBarRight'>
        <Badge badgeContent={unreadCount} color="success">
          <NotificationsOutlinedIcon style={{ cursor: 'pointer' }} onClick={toggleNotificationDrawer} />
        </Badge>
        
          <p className='navUserName'>{userName}</p>
        {!isMobileView && (
        <Button variant='contained' style={{ color: "white" }} onClick={handleLogOut}>Logout</Button>
        )}

      </div>
      {NotificationDrawer}
    </div>
  );
};

export default NavBar;