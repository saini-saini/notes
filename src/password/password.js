import React, { useEffect, useState } from 'react'
import { Button, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './password.css'
import CreatePassword from './createPassword';
import { eventEmitter } from '../utils/eventEmitter';
import { auth } from '../firebaseFireStore/config';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { dataBase } from '../firebaseFireStore/config';
import Loding from '../loader/loder';
import EditPassword from './editPassword';


const Password = () => {
  const [loading, setLoading] = useState(false);
  const [openCreatePassword, setOpenCreatePassword] = useState(false);
  const [openEditPassword, setOpenEditPassword] = useState(false);
  const authData = auth;
  const user = authData.currentUser;
  const passwordCollection = collection(dataBase, "password");
  const [passwordData, setPasswordData] = useState([]);
  const [selectedPassword, setSelectedPassword] = useState(null);

  const handleOpenCreatePassword = () => {
    setOpenCreatePassword(true);
  };

  const handleCloseCreatePassword = () => {
    setOpenCreatePassword(false);
  };

  const handleOpenPassword = (value) => {
    setOpenEditPassword(true);
    setSelectedPassword(value);
  };

  const handleClosePassword = () => {
    setOpenEditPassword(false);
    setSelectedPassword(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(passwordCollection, id));
      eventEmitter.dispatch('passwordDeleted');
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    const getPassword = async () => {
      setLoading(true);
      try {
        const passwordsQuery = query(passwordCollection, where("email", "==", user.email));
        const data = await getDocs(passwordsQuery);
        const passwords = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPasswordData(passwords);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getPassword();
    }

    const createPassword = eventEmitter.subscribe('passwordCreated', getPassword);
    const deletePassword = eventEmitter.subscribe('passwordDeleted', getPassword);
    const updatePassword = eventEmitter.subscribe('passwordUpdated', getPassword);

    return () => {
      createPassword();
      deletePassword();
      updatePassword();
    };
  }, [user]);
  
  console.log(passwordData,"passwordData")
  return (
    <div className='passwordContainer'>
      {loading && (
        <Loding />
      )}
      {!loading && (
          <div>
      <div className='passwordTop'>
        <p className='passwordHeading'>Password</p>
        <Button variant="contained" onClick={handleOpenCreatePassword}><AddIcon />Create</Button>
      </div>

      <div className='passwordBottom'>
        <div className='password-cardContainer'>
          {passwordData.map((value, index) => (
            <div className='password-cardWrapper' key={index}>
              <div className='cardInfo'>
                <p className='cardPara'><span className='cardSpan'>Title:</span>{value?.title}</p>
                <Tooltip title={value?.password} disableHoverListener={value?.password.length <= 200}>
                  <p className='cardPara password-description'>
                    <span className='cardSpan description'>Password:</span>
                    {value?.password.length > 200 ? `${value.password.substring(0, 200)}...` : value.password}
                  </p>
                </Tooltip>
              </div>
              <div className='cardAction'>
                <Button variant="outlined" onClick={() => handleOpenPassword(value)}><EditIcon /></Button>
                <Button variant="outlined" onClick={() => handleDelete(value.id)}><DeleteIcon /></Button>
              </div>
            </div>
          ))}

        </div>
      </div>
      <CreatePassword open={openCreatePassword} handleClose={handleCloseCreatePassword} />
      <EditPassword open={openEditPassword} handleClose={handleClosePassword} selectedPassword={selectedPassword} />
      </div>
      )}
    </div>
  )
}

export default Password
