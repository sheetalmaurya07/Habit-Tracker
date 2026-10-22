import React from "react";

function Toast(props) {

    return (
      <div id="toast" className={`toast${props.show ? ' show': ''}`}>
        {props.Message}
      </div>
    )
}

export default Toast;