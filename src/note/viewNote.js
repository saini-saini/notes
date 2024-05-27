import { Chip, Dialog } from '@mui/material'
import React from 'react'

const ViewNote = ({ open, handleClose, selectedNote }) => {

    const formatDate = (seconds) => {
        const date = new Date(seconds * 1000);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const handleDialogClose = () => {
        handleClose();
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

        <div className='view-card-wrapper'>
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    classes={{ paper: 'view-dialog' }}
                >
                    <div className='view-cardWrapper' key={'index'} style={{ backgroundColor: generateRandomColor() }}
                    >
                        <div className='cardInfo'>
                            <p className='cardPara'><span className='view-cardSpan'>Title:</span>{selectedNote?.title}</p>
                            <p className='cardPara description'>
                                <span className='view-cardSpan description'>Description:</span>
                                {selectedNote?.description}
                            </p>
                        </div>
                        <div className='cardStatus'>
                            <div>
                                <span className='cardSpan'>Priority:</span>
                                <Chip style={{ backgroundColor: selectedNote?.priority === "high" ? "red" : selectedNote?.priority === "medium" ? "orange" : "green", color: "white", marginLeft: "5px" }} label={selectedNote?.priority} />
                            </div>
                            <p className='cardDate'>{formatDate(selectedNote?.date?.seconds)}</p>
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    )
}

export default ViewNote
