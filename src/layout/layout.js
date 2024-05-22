import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Note from '../note/note';
import Password from '../password/password';
import './layout.css';
import NavBar from '../navbar/navBar';
import { Avatar, Button } from '@mui/material';
import { Outlet } from 'react-router-dom';
export default function Layout({userName}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className='layout'>
      {/* <div style={{display:'flex'}}>
      <div style={{display:'flex'}}>
       <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      <Button style={{ color: "black" }}>Logout</Button>
      </div>

      <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon position tabs example"
      >
        <Tab icon={<EditNoteIcon />} iconPosition="start" label="Note" />
        <Tab icon={<VpnKeyIcon />} iconPosition="start" label="Password" />
      </Tabs>
      </div>
      </div>
      {value === 0 && <Note />}
      {value === 1 && <Password />} */}
     

     

       <div className='layoutNavbar'>
      <NavBar userName={userName}/>
      </div>

      <div className='layoutBottom'>
      <Outlet />
      </div> 
    </div>
  );
}
