import React from "react";
import PropTypes from "prop-types";
import previous from "../images/left-arrow.svg"
import next from "../images/right-arrow.svg"
import { Link } from "react-router-dom";

const Paginator = props => {

  const { count, itemsPerPage, currentPage, pathBase } = props;


  const pageCount = Math.ceil(count / itemsPerPage);
  const pageNumbers = [...Array(pageCount).keys()];
  const hasPrevious = currentPage !== 1;
  const hasNext = currentPage !== pageCount;

  return (
    <div className="paginator">
      {hasPrevious ? (
        <Link to={`${pathBase}?page=${currentPage - 1}`}><img src={previous} alt="next" /></Link>
      ) : (
        <a className="disabled"><img src={previous} alt="next" /></a>
      )}
      {pageNumbers.map(n => {
        const className = n + 1 === currentPage ? "current" : null;
        return (
          <Link key={n} to={`${pathBase}?page=${n + 1}`} className={className}>
            {n + 1}
          </Link>
        )
      })}
      {hasNext ? (
        <Link to={`${pathBase}?page=${currentPage + 1}`}><img src={next} alt="next" /></Link>
      ) : (
        <a className="disabled"><img src={next} alt="next" /></a>
      )}
    </div>
  );
};

Paginator.propTypes = {
  
};

export default Paginator;