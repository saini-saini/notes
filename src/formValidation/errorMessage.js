import React from 'react'

const TextError = (props) => {
  return (
    <div style={{color: '#E34746' , justifyContent: 'center'}}>
      {props.children}
    </div>
  )
}

export default TextError;