import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { eventEmitter } from '../utils/eventEmitter';
import { dataBase } from '../firebaseFireStore/config';
import { auth } from '../firebaseFireStore/config';

export default function CreatePassword({ open, handleClose }) {
  const passwordCollection = collection(dataBase, "password");
  const authData = auth;
  const user = authData.currentUser;

  const formik = useFormik({
    initialValues: {
      title: '',
      password: '',
    },
    onSubmit: async (values) => {
      const passwordData = {
        ...values,
        email: user ? user.email : 'No user email',
      };
      try {
        const docRef = await addDoc(passwordCollection, passwordData);
        console.log("Document written with ID: ", docRef.id);
        eventEmitter.dispatch('passwordCreated');
        formik.resetForm();
        handleClose();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
  });

  const handleDialogClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Create Password"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div className='createNoteInput'>
            <TextField
              id="standard-basic"
              label="Title"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              variant="standard"
            />

            <TextField
              id="standard-multiline-flexible"
              multiline
              maxRows={4}
              label="Password"
              variant="standard"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </div>

          <DialogActions>
            <Button variant='contained' autoFocus type="submit" style={{ marginTop: '10px' }}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
