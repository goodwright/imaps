import React from "react";
import PropTypes from "prop-types";
import paperIcon from "../images/paper.svg";
import cross from "../images/close.svg";

const PapersList = props => {

  const { papers, setPapers } = props;

  const paperIsBlank = paper => !paper.year && !paper.title && !paper.url;

  const updatePaper = (index, property, value) => {
    const updated = [...papers];
    updated[index][property] = value;
    setPapers(updated.filter(paper => !paperIsBlank(paper)).concat({
      year: "", title: "", url: ""
    }));
  }

  const removePaper = index => {
    const updated = papers.filter((paper, i) => index !== i);
    setPapers(updated.filter(paper => !paperIsBlank(paper)).concat({
      year: "", title: "", url: ""
    }));
  }

  const last = papers[papers.length - 1];
  if (setPapers && (!last || !paperIsBlank(last))) {
    papers.push({year: "", title: "", url: ""});
  }

  const inputClass = "bg-gray-100 border-b border-primary-100 text-xs py-0.5 h-6"


  return (
    <div className="flex flex-wrap -mr-6 -mb-3 2xl:grid 2xl:mb-0 2xl:mr-0">
      {papers.map((paper, index) => {
        if (setPapers) {
          return (
            <div className="mr-6 mb-3 flex items-center 2xl:mr-0" key={index}>
              <div>
                <input
                  className={`${inputClass} w-full`}
                  value={paper.title}
                  onChange={e => updatePaper(index, "title", e.target.value)}
                  placeholder="title"
                />
                <div className="flex">
                  <input
                    type="number"
                    className={`${inputClass} w-12 mr-2`}
                    value={paper.year}
                    onChange={e => updatePaper(index, "year", e.target.value)}
                    placeholder="year"
                  />
                  <input
                    className={`${inputClass}`}
                    value={paper.url}
                    onChange={e => updatePaper(index, "url", e.target.value)}
                    placeholder="URL"
                  />
                </div>
              </div>
              {!paperIsBlank(paper) && (
                <div className="ml-2 text-sm w-4 opacity-50 cursor-pointer hover:opacity-60" onClick={() => removePaper(index)}>
                  <img src={cross} alt="remove" />
                </div>
              )}
            </div>
          )
        } else {
          return (
            <a href={paper.url} className="flex items-center mr-6 mb-3 2xl:mb-0 2xl:mr-0" key={index}>
              <img className="w-6 sm:w-8" src={paperIcon} alt="paper"/>
              <div className="inline text-xs ml-2 flex-wrap whitespace-wrap">
                ({paper.year}) {paper.title}
              </div>
            </a>
          )
        }
      })}
    </div>
  );
};

PapersList.propTypes = {
  papers: PropTypes.array.isRequired,
  setPapers: PropTypes.func
};

export default PapersList;