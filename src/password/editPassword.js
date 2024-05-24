import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { eventEmitter } from '../utils/eventEmitter';
import { dataBase } from '../firebaseFireStore/config';
import { auth } from '../firebaseFireStore/config';

export default function EditPassword({ open, handleClose, selectedPassword }) {
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
                const passwordRef = doc(dataBase, "password", selectedPassword.id);
                await updateDoc(passwordRef, passwordData);
                console.log("Document updated with ID: ", passwordRef.id);
                eventEmitter.dispatch('passwordUpdated');
                formik.resetForm();
                handleClose();
            } catch (e) {
                console.error("Error updating document: ", e);
            }
        },
    });

    const handleDialogClose = () => {
        formik.resetForm();
        handleClose();
    };

    React.useEffect(() => {
        if (open && selectedPassword) {
            formik.setValues({
                title: selectedPassword.title,
                password: selectedPassword.password,
            });
        }
    }, [open, selectedPassword]);

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