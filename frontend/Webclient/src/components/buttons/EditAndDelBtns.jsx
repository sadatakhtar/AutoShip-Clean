import React from 'react';
import styled from 'styled-components';

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

const EditAndDelBtns = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ padding: '5px' }}>
        <MyButton
          style={{ backgroundColor: 'green' }}
          onClick={() => console.log('Edit btn clicked')}
        >
          Edit
        </MyButton>
      </div>
      <div style={{ padding: '5px' }}>
        <MyButton
          className="myButton"
          onClick={() => console.log('Del btn clicked')}
        >
          Delete
        </MyButton>
      </div>
    </div>
  );
};

export default EditAndDelBtns;
