import React from "react";
import PropTypes from "prop-types";
import previous from "../images/left-arrow.svg"
import next from "../images/right-arrow.svg"
import { Link } from "react-router-dom";

const Paginator = props => {

  const { count, itemsPerPage, currentPage, pathBase, onClick } = props;
  const pageCount = Math.ceil(count / itemsPerPage);
  const pageNumbers = [...Array(pageCount).keys()];
  const hasPrevious = currentPage !== 1;
  const hasNext = currentPage !== pageCount;

  return (
    <div className="paginator">
      {hasPrevious ? pathBase ? (
        <Link to={`${pathBase}?page=${currentPage - 1}`}><img src={previous} alt="previous" /></Link>
      ) : (
        <a onClick={() => onClick(currentPage - 1)}><img src={previous} alt="previous" /></a>
      ) : (
        <a className="disabled"><img src={previous} alt="next" /></a>
      )}
      {pageNumbers.map(n => {
        const className = n + 1 === currentPage ? "current" : null;
        if ( Math.abs((n + 1) - currentPage) > 1 && n > 1 && n < pageCount - 2) {
          if (n === currentPage - 3 || n === currentPage + 1) {
            return <div key={n}>...</div>
          }
          return <div key={n} />
        }
        if (pathBase) {
          return ( 
            <Link key={n} to={`${pathBase}?page=${n + 1}`} className={className}>
              {n + 1}
            </Link>
          )
        } else {
          return (
            <a className={className} key={n} onClick={() => onClick(n + 1)}>{n + 1}</a>
          )
        }
      })}
      {hasNext ? pathBase ? (
        <Link to={`${pathBase}?page=${currentPage + 1}`}><img src={next} alt="next" /></Link>
      ) : (
        <a onClick={() => onClick(currentPage + 1)}><img src={next} alt="next" /></a>
      ) : (
        <a className="disabled"><img src={next} alt="next" /></a>
      )}
    </div>
  );
};

Paginator.propTypes = {
  
};

export default Paginator;