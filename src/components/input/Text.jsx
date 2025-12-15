import React from 'react'

const Text = ({name,label}) => {
  return (
    <div>
        <label htmlFor={name}>
            <input type="text" name={name} />
        </label>
    </div>
  )
}

export default Text
