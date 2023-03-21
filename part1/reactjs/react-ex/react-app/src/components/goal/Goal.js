import React, { useState } from "react";
import styles from "./Goal.module.css";

const Goal = ({ status, msg, onCheckChange }) => {
  return (
    <div className={styles.goalWrap}>
      <label
        className={status ? styles.text : styles.textDisabled}
        for="scales"
      >
        <input
          type="checkbox"
          id="scales"
          name="scales"
          onChange={onCheckChange}
        />
        {msg}
      </label>
    </div>
  );
};

export default Goal;
