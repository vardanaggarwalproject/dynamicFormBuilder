import React from 'react'

const Checkbox = ({name,label}) => {
  return (
    <div>   
        <label htmlFor="">
            <input type="checkbox" name={name} {...register()}/>
        </label>
    </div>
  )
}

export default Checkbox
