import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Typography } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { eventEmitter } from '../utils/eventEmitter';
import { dataBase } from '../firebaseFireStore/config';
import { auth } from '../firebaseFireStore/config';
import { CreatePasswordValidation } from '../formValidation/formValidation';

export default function EditPassword({ open, handleClose, selectedPassword }) {
    const authData = auth;
    const user = authData.currentUser;

    const formik = useFormik({
        initialValues: {
            title: '',
            password: '',
        },
        validationSchema: CreatePasswordValidation,
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
                    {"Edit Password"}
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <div className='createNoteInput'>
                        <TextField
                            id="standard-basic"
                            label={
                                <Typography>
                                    Title<span style={{ color: 'red' }}>*</span> 
                                </Typography>
                            }
                            name="title"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            variant="standard"
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />

                        <TextField
                            id="standard-multiline-flexible"
                            multiline
                            maxRows={4}
                            label={
                                <Typography>
                                    Password<span style={{ color: 'red' }}>*</span> 
                                </Typography>
                            }
                            variant="standard"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
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