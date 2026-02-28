import React, { useState } from 'react';
import styled from 'styled-components';
import DeleteModal from '../modals/DeleteModal';
import PropTypes from 'prop-types';

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

const EditAndDelBtns = ({ id, onDelete, onEdit, vehicle }) => {
  const [open, setOpen] = useState(false);
 
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ padding: '5px' }}>
        <MyButton
          style={{ backgroundColor: 'green' }}
          onClick={() => onEdit(vehicle)}
        >
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
        carId={vehicle?.id}
        onClose={() => setOpen(false)}
        onConfirm={(id) => {
          onDelete(id);
          setOpen(false);
        }}
      />
    </div>
  );
};

EditAndDelBtns.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EditAndDelBtns;
