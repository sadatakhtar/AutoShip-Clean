import React, { useState } from 'react';
import styled from 'styled-components';
import DeleteModal from '../modals/DeleteModal';

const MyButton = styled.button`
  background-color: red;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: pink;
    color: black;
  }
`;

const EditAndDelBtns = ({ id, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ padding: '5px' }}>
        <MyButton style={{ backgroundColor: 'green' }} onClick={() => {}}>
          Edit
        </MyButton>
      </div>
      <div style={{ padding: '5px' }}>
        <MyButton className="myButton" onClick={() => setOpen(true)}>
          Delete
        </MyButton>
      </div>
      <DeleteModal
        open={open}
        carId={id}
        onClose={() => setOpen(false)}
        onConfirm={(id) => {
          onDelete(id);
          setOpen(false);
        }}
      />
    </div>
  );
};

export default EditAndDelBtns;
