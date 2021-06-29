import React, { useRef } from "react";
import PropTypes from "prop-types";

const Modal = props => {
  /**
   * A white box that floats over the page.
   */

  const { showModal, setShowModal, title, text } = props;
  const boxRef = useRef();

  const dismiss = e => {
    if (!boxRef.current.contains(e.target)) {
      setShowModal(false);
    }
  }

  return (
    <div className={showModal ? "fixed left-0 top-0 w-full h-full flex items-center bg-opacity-40 justify-center bg-gray-700 z-50" : "hidden"} onClick={dismiss}>
      <div className={`bg-white rounded-md w-max overflow-hidden p-7 p-6 ml-6 mr-6 ${props.className || ""}`} ref={boxRef}>
        {title && <div className="text-primary-500 text-3xl mb-3">{title}</div>}
        {text && <div className="text-primary-700 mb-4">{text}</div>}
        {props.children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default Modal;