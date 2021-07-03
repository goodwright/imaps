import React from "react";
import PropTypes from "prop-types";
import previousIcon from "../images/left-arrow.svg";
import nextIcon from "../images/right-arrow.svg";

const Paginator = props => {

  const { currentPage, totalPages, onChange } = props;

  let cells = [...Array(totalPages).keys()].map(p => p + 1);
  if (totalPages > 7) {
    if (currentPage <= 2 || currentPage >= totalPages - 1) {
      cells = [1, 2, 3, null, totalPages - 2, totalPages - 1, totalPages];
    } else if (currentPage <= 4) {
      cells = [1, 2, 3, 4, 5, null, totalPages];
    } else if (currentPage >= totalPages - 3) {
      cells = [1, null, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      cells = [1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages]
    }
  }

  const arrowClass = "px-2 flex items-center justify-end rounded-xl w-6 sm:w-8";

  return (
    <div className={`flex w-max overflow-hidden items-center ${props.className || ""}`}>
      <div
        className={`${arrowClass} rounded-r-none ${currentPage === 1 ? "opacity-50" : "cursor-pointer hover:bg-gray-50"}`}
        onClick={() => currentPage !== 1 && onChange(currentPage - 1)}
      >
        <img src={previousIcon} alt="previous" className="w-5 h-5" />
      </div>
      {cells.map((page, index) => {
        let className = "w-6 h-6 px-2 py-2 text-xs font-medium flex rounded-lg items-center justify-center ml-px text-gray-500 select-none sm:w-8 sm:h-8 sm:px-3";
        if (!page) {
          return (
            <div key={index} className={`${className} relative bottom-px`}>...</div>
          )
        }
        if (page === currentPage) className += " bg-primary-500  bg-opacity-80 text-purple-50 relative z-10";
        if (page !== currentPage) className += " cursor-pointer hover:bg-gray-100"
        return (
          <div
            key={index}
            className={className}
            onClick={() => onChange(page)}
          >{page}</div>
        )
      })}
      <div
        className={`${arrowClass} rounded-l-none ${currentPage === totalPages ? "opacity-50" : "cursor-pointer hover:bg-gray-50"}`}
        onClick={() => currentPage !== totalPages && onChange(currentPage + 1)}
      >
        <img src={nextIcon} alt="next" className="w-5 h-5" />
      </div>
    </div>
  );
};

Paginator.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Paginator;