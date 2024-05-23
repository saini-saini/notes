import React from 'react'
import './navBar.css'
import { Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from '../firebaseFireStore/config'
import { signOut } from 'firebase/auth'
const NavBar = ({ userName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className='navBarContainer'>
      <div className='navBarLeft'>
        <li className={`navButton ${location.pathname === '/home' ? 'active' : ''}`} onClick={() => navigate('/home')}>Notes</li>
        <li className={`navButton ${location.pathname === '/home/password' ? 'active' : ''}`} onClick={() => navigate('/home/password')}>Password</li>
      </div>

      <div className='navBarRight'>

        <p className='navUserName'>{userName}</p>

        <Button variant='contained' style={{ color: "white" }} onClick={() => handleLogOut()}>Logout</Button>

      </div>
    </div>
  )
}

export default NavBar
