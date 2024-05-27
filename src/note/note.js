import { Button, Chip, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNote from './createNote';
import './note.css';
import EditNote from './editNote';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { dataBase } from '../firebaseFireStore/config';
import { eventEmitter } from '../utils/eventEmitter';
import Loding from '../loader/loder';
import { auth } from '../firebaseFireStore/config';
import priorityIcon from "../images/prioritize.png";
import { Empty } from 'antd';


const Note = () => {
  const [openCreateNote, setOpenCreateNote] = useState(false);
  const [openEditNote, setOpenEditNote] = useState(false);
  const [noteData, setNoteData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState("all");
  const authData = auth;
  const user = authData.currentUser;
  const notesCollection = collection(dataBase, "notes");

  const handleOpenCreateNote = () => {
    setOpenCreateNote(true);
  };

  const handleCloseCreateNote = () => {
    setOpenCreateNote(false);
  };

  const handleOpenEditNote = (value) => {
    setOpenEditNote(true);
    setSelectedNote(value);
  };

  const handleCloseEditNote = () => {
    setOpenEditNote(false);
    setSelectedNote(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(notesCollection, id));
      eventEmitter.dispatch('noteDeleted');
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (priority) => {
    setFilter(priority);
    if (priority === "all") {
      setFilteredData(noteData);
    } else {
      setFilteredData(noteData.filter(note => note.priority === priority));
    }
    handleMenuClose();
  };

  useEffect(() => {
    const getNotes = async () => {
      setLoading(true);
      try {
        const notesQuery = query(notesCollection, where("email", "==", user.email));
        const data = await getDocs(notesQuery);
        const notes = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        notes.sort((a, b) => b.date.seconds - a.date.seconds);
        setNoteData(notes);
        setFilteredData(notes);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getNotes();
    }
    const createNote = eventEmitter.subscribe('noteCreated', getNotes);
    const deleteNote = eventEmitter.subscribe('noteDeleted', getNotes);
    const updateNote = eventEmitter.subscribe('noteUpdated', getNotes);
    return () => {
      createNote();
      deleteNote();
      updateNote();
    };
  }, [user]);

  const formatDate = (seconds) => {
    const date = new Date(seconds * 1000);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const generateRandomColor = () => {
    const minBrightness = 200;
    const maxBrightness = 255;
    const r = Math.floor(Math.random() * (maxBrightness - minBrightness) + minBrightness);
    const g = Math.floor(Math.random() * (maxBrightness - minBrightness) + minBrightness);
    const b = Math.floor(Math.random() * (maxBrightness - minBrightness) + minBrightness);
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return color;
  };

  return (
    <div className='noteContainer'>
      {loading && (
        <Loding />
      )}
      {!loading && (
        <div>
          <div className='noteTop'>
            <p className='noteHeading'>Notes</p>
            <div className='filter'>
              <p>Filter</p>
              <Tooltip title="Priority">
                <Button variant='contained' onClick={handleMenuOpen}>
                  <img src={priorityIcon} alt="" style={{ width: "30px", height: "30px" }} />
                </Button>
              </Tooltip>
            </div>
            <Button variant="contained" onClick={handleOpenCreateNote} className='noteButton'><AddIcon />Create</Button>
          </div>
          <div className='noteBottom'>
            {
              filteredData?.length === 0 ? <p className='notePara'><Empty className='noteData' /></p> :
                <div className='cardContainer'>
                  {filteredData.map((value, index) => (
                    <div className='cardWrapper' key={index} style={{ backgroundColor: generateRandomColor() }}>
                      <div className='cardInfo'>
                        <p className='cardPara'><span className='cardSpan'>Title:</span>{value?.title}</p>
                        <Tooltip title={value?.description} disableHoverListener={value?.description.length <= 200}>
                          <p className='cardPara description'>
                            <span className='cardSpan description'>Description:</span>
                            {value?.description.length > 200 ? `${value.description.substring(0, 200)}...` : value.description}
                          </p>
                        </Tooltip>
                      </div>
                      <div className='cardAction'>
                        <Button variant="outlined" onClick={() => handleOpenEditNote(value)}><EditIcon /></Button>
                        <Button variant="outlined" onClick={() => handleDelete(value.id)}><DeleteIcon /></Button>
                      </div>
                      <div className='cardStatus'>
                        <div>
                          <span className='cardSpan'>Priority:</span>
                          <Chip style={{ backgroundColor: value?.priority === "high" ? "red" : value?.priority === "medium" ? "orange" : "green", color: "white", marginLeft: "5px" }} label={value?.priority} />
                        </div>
                        <p className='cardDate'>{formatDate(value?.date?.seconds)}</p>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
          <CreateNote open={openCreateNote} handleClose={handleCloseCreateNote} />
          <EditNote open={openEditNote} handleClose={handleCloseEditNote} selectedNote={selectedNote} />
        </div>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleFilterChange("all")}>All</MenuItem>
        <MenuItem onClick={() => handleFilterChange("high")}>High</MenuItem>
        <MenuItem onClick={() => handleFilterChange("medium")}>Medium</MenuItem>
        <MenuItem onClick={() => handleFilterChange("low")}>Low</MenuItem>
      </Menu>
    </div>
  );
}

export default Note;