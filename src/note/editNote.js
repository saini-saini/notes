import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { eventEmitter } from '../utils/eventEmitter';
import { doc, updateDoc } from 'firebase/firestore';
import { dataBase } from '../firebaseFireStore/config';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { auth } from '../firebaseFireStore/config';

export default function EditNote({ open, handleClose, selectedNote }) {
    const [priority, setPriority] = React.useState('');
    const authData = auth;
    const user = authData.currentUser;

    const handleChange = (event) => {
        setPriority(event.target.value);
        formik.setFieldValue('priority', event.target.value);
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            priority: '',
            date: null,
        },
        onSubmit: async (values) => {
            values.priority = priority;
            if (values.date && dayjs.isDayjs(values.date)) {
                values.date = values.date.toDate();
            }

            const noteData = {
                ...values,
                email: user ? user.email : 'No user email',
            };

            try {
                const noteRef = doc(dataBase, "notes", selectedNote.id);
                await updateDoc(noteRef, noteData);
                console.log("Document updated with ID: ", noteRef.id);
                eventEmitter.dispatch('noteUpdated');
                formik.resetForm();
                handleClose();
            } catch (e) {
                console.error("Error updating document: ", e);
            }
        },
    });

    React.useEffect(() => {
        if (open && selectedNote) {
            formik.setValues({
                title: selectedNote.title,
                description: selectedNote.description,
                priority: selectedNote.priority,
                date: selectedNote.date ? dayjs(selectedNote.date.toDate()) : null,
            });
            setPriority(selectedNote.priority);
        }
    }, [open, selectedNote]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Edit Note"}
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
                            variant="standard" />

                        <TextField
                            id="standard-multiline-flexible"
                            multiline
                            maxRows={4}
                            label="Description"
                            variant="standard"
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description} />

                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Priority</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={priority}
                                onChange={handleChange}
                                label="Priority"
                            >
                                <MenuItem value={'low'}>Low</MenuItem>
                                <MenuItem value={'medium'}>Medium</MenuItem>
                                <MenuItem value={'high'}>High</MenuItem>
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Date"
                                    value={formik.values.date}
                                    onChange={(date) => formik.setFieldValue('date', date)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
}
