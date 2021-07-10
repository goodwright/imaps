import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Select from "../components/Select";
import PekaHeatmap from "./PekaHeatmap";
import PekaRbp from "./PekaRbp";
import Base from "../pages/Base";
import PekaMotif from "./PekaMotif";
const colors = require("tailwindcss/colors");

const PekaPage = () => {

  // What arguments are there?
  const params = new URLSearchParams(useLocation().search);
  const rbp = params.get("rbp");
  const motif = params.get("motif");
  const [data, setData] = useState(null);
  const [searchAvtive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  useEffect(() => {
    document.title = `iMaps - ${rbp || ""} PEKA`;
  });

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/graphql`.replace("graphql", `peka/entities/`)
    ).then(resp => resp.json()).then(json => {
      setData(json);
    })
  }, [])

  const searchData = data ? data.proteins.map(name => ({
    label: name, value: name
  })).concat(data.motifs.map(name => ({
    label: name, value: name
  }))) : [];

  const searchSelected = e => {
    history.push(`/apps/peka?${e.label.length === 5 ? "motif" : "rbp"}=${e.label}`);
    setSearchTerm("");
    setSearchActive(false);
  }

  const downloadData = (json, name) =>{
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",  dataStr);
    downloadAnchorNode.setAttribute("download", `${name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const customStyles = {
    control: () => ({
      backgroundColor: "white",
      borderColor: colors.gray[200],
      borderWidth: 1,
      cursor: "text",
      boxShadow: null,
      "&:hover": {
        boxShadow: null,
      }
      
    }),
    dropdownIndicator: () => ({
      opacity: 0
    }),
  }

  return (
    <Base>
      <div className="flex items-center justify-between max-w-4xl mb-2 sm:mb-3 md:mb-4">
        <h1 className="mb-0">PEKA</h1>
        <Select
          key={rbp || motif}
          options={searchData}
          onFocus={() => setSearchActive(true)}
          onBlur={() => setSearchActive(false)}
          value={null}
          menuIsOpen={searchTerm.length >= 2}
          onInputChange={value => setSearchTerm(value)}
          onChange={searchSelected}
          onClick={console.log}
          placeholder={searchAvtive ? "" : "Search..."}
          styles={customStyles}
          className="w-96 ml-3"
        />
      </div>
      <p className="text-xs sm:text-sm md:text-base max-w-4xl border-b pb-4">
        Positionally-enriched k-mer analysis (PEKA) is a software package for identifying
        enriched protein-RNA binding motifs from CLIP datasets. PEKA compares k-mer enrichment
        in proximity of high-confidence crosslink sites (tXn - thresholded crosslinks),
        located within crosslinking peaks and having a high cDNA count, relative to low-count
        crosslink sites located outside of peaks (oXn - outside crosslinks). This approach
        reduces the effects of technical biases, such as uridine-preference of UV crosslinking.
        Each k-mer is assigned a PEKA score, which is used to rank the k-mers from the most
        to the least enriched. Additionally, PEKA provides comprehensive visualisations of
        motif enrichment profiles around the high-confidence crosslink sites and clusters
        the motifs that display similar profiles. PEKA also enables motif discovery within 
        specific transcriptomic regions, including or excluding repetitive elements. PEKA
        code is available from <a href="https://github.com/ulelab/imaps/blob/master/src/imaps/sandbox/kmers.py">Ulelab github</a>.
      </p>
      {rbp ? <PekaRbp rbp={rbp} download={downloadData} /> : motif ? <PekaMotif motif={motif} download={downloadData}/> : <PekaHeatmap download={downloadData} /> }
    </Base>
  )
};

PekaPage.propTypes = {
    
};

export default PekaPage;