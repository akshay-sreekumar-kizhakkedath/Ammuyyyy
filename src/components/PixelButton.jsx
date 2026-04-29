import React from 'react';
import styles from './PixelButton.module.css';

const PixelButton = ({ onClick, children }) => {
    return (
        <button className={styles.pixelButton} onClick={onClick}>
            {children}
        </button>
    );
};

export default PixelButton;
