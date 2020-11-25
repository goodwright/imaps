import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useRef } from "react";

const Modal = props => {
  /**
   * A white box that floats over the page.
   */

  const { showModal, setShowModal } = props;
  const boxRef = useRef();

  const className = classNames({modal: true, visible: showModal});

  const boxClassName = classNames({
    "modal-box": true, [props.className]: true
  });

  const dismiss = e => {
    if (!boxRef.current.contains(e.target)) {
      setShowModal(false);
    }
  }

  return (
    <div className={className} onClick={dismiss}>
      <div className={boxClassName} ref={boxRef}>
        {props.children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  className: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired
};

export default Modal;