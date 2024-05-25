import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { eventEmitter } from '../utils/eventEmitter';
import { doc, updateDoc } from 'firebase/firestore';
import { dataBase } from '../firebaseFireStore/config';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { auth } from '../firebaseFireStore/config';

const EditNoteValidation = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().required("Priority is required"),
    date: Yup.date().required("Date is required"),
});

export default function EditNote({ open, handleClose, selectedNote }) {
    const authData = auth;
    const user = authData.currentUser;

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            priority: '',
            date: null,
        },
        validationSchema: EditNoteValidation,
        onSubmit: async (values) => {
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
        }
    }, [open, selectedNote]);

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
                <DialogTitle id="alert-dialog-title" style={{display:"flex", justifyContent:"center",fontSize:'23px'}}>
                    {"Edit Note"}
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
                                    Description<span style={{ color: 'red' }}>*</span> 
                                </Typography>
                            }
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
                              <InputLabel id="priority-select-label">{
                                <Typography>
                                    Priority<span style={{ color: 'red' }}>*</span>
                                </Typography>
                            }</InputLabel>
                            <Select
                                labelId="priority-select-label"
                                id="priority-select"
                                name="priority"
                                value={formik.values.priority}
                                onChange={(event) => {
                                    formik.handleChange(event);
                                }}
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
                                    label={
                                        <Typography>
                                            Reminder<span style={{ color: 'red' }}>*</span> 
                                        </Typography>
                                    }
                                    value={formik.values.date}
                                    onChange={(date) => formik.setFieldValue('date', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={formik.touched.date && Boolean(formik.errors.date)}
                                            helperText={formik.touched.date && formik.errors.date}
                                        />
                                    )}
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
