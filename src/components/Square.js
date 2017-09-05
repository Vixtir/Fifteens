import React from 'react';

const Square = (props) =>{
  return(
    <div className={props.className} onClick={props.onClick} >
      {props.value ? props.value : ''}
    </div>
  )
}

export default Square;