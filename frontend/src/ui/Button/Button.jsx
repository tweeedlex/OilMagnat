import React from 'react';
import styles from "./Button.module.scss"

const Button = ({children, variant = "default", onClick = () => {}, width = ""}) => {
  return (
    <button
      style={{width}}
      onClick={onClick}
      className={[styles.button, styles[variant]].join(" ")}
    >
      {children}
    </button>
  );
}

export default Button;