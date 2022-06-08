import React from "react";
import c from "./Spinner.module.css";

const Spinner = (props) => {
  return (
    <div className={c.loader}>
      <div onClick={props.onCancel} className={c.x}>
        X
      </div>
    </div>
  );
};

export default Spinner;
