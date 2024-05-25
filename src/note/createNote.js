import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { eventEmitter } from '../utils/eventEmitter';
import { dataBase } from '../firebaseFireStore/config';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { auth } from '../firebaseFireStore/config';
import { CreateNoteValidation } from '../formValidation/formValidation';

export default function CreateNote({ open, handleClose }) {
    const notesCollection = collection(dataBase, "notes");
    const authData = auth;
    const user = authData.currentUser; 

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            priority: '',
            date: dayjs(),
        },
        validationSchema: CreateNoteValidation,
        onSubmit: async (values) => {
            if (values.date && dayjs.isDayjs(values.date)) {
                values.date = values.date.toDate(); 
            }

            const noteData = {
                ...values,
                email: user ? user.email : 'No user email',
            };

            try {
                const docRef = await addDoc(notesCollection, noteData);
                console.log("Document written with ID: ", docRef.id);
                eventEmitter.dispatch('noteCreated');
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
                    {"Create Note"}
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
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />

                        <TextField
                            id="standard-multiline-flexible"
                            multiline
                            maxRows={4}
                            label="Description"
                            variant="standard"
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />

                        <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={formik.touched.priority && Boolean(formik.errors.priority)}
                        >
                            <InputLabel id="priority-select-label">Priority</InputLabel>
                            <Select
                                labelId="priority-select-label"
                                id="priority-select"
                                name="priority"
                                value={formik.values.priority}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value={'low'}>Low</MenuItem>
                                <MenuItem value={'medium'}>Medium</MenuItem>
                                <MenuItem value={'high'}>High</MenuItem>
                            </Select>
                            {formik.touched.priority && formik.errors.priority && (
                                <div style={{ color: 'red', marginTop: '0.5rem' }}>
                                    {formik.errors.priority}
                                </div>
                            )}
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Reminder"
                                    value={formik.values.date}
                                    onChange={(date) => formik.setFieldValue('date', date)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
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
