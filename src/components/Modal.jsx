import React from 'react';

function Modal(props) {
  const { children, handleCloseModal } = props;

  function handleModalClick(e) {
    e.stopPropagation();
  }

  return (
    <div className="screen" onClick={handleCloseModal}>
      <div className="modal" onClick={handleModalClick}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
