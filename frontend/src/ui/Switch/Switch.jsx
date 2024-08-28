import React, {useState} from 'react';
import styles from "./Switch.module.scss"

const Switch = ({defaultOptions}) => {
  const [options, setOptions] = useState(defaultOptions);

  return (
    <div className={styles.switch}>
      {options.map(option => (
        <button
          onClick={() => {
            option.callback && option.callback()
            setOptions(options.map(opt => ({...opt, isActive: opt.text === option.text})))
          }}
          className={option.isActive ? styles.active : ""}
          key={option.text}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}

export default Switch;