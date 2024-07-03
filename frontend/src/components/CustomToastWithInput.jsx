import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CustomToastWithInput = ({ closeToast, setRoomName }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    setRoomName(inputValue);
    closeToast();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter room name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="p-2 border rounded"
      />
      <button onClick={handleSubmit} className="ml-2 p-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </div>
  );
};
export default CustomToastWithInput;