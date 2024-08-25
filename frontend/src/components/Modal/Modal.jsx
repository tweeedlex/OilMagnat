import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={"button-default"}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
