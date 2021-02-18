import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Select from "react-select";
import PekaHeatmap from "../components/PekaHeatmap";
import PekaRbp from "../components/PekaRbp";
import Base from "./Base";
import { getApiLocation } from "../api";

const PekaPage = () => {

  // What arguments are there?
  const params = new URLSearchParams(useLocation().search);
  const rbp = params.get("rbp");
  const sequence = params.get("sequence");
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  useEffect(() => {
    document.title = `iMaps - ${rbp || ""} PEKA`;
  });

  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", `peka/entities/`)
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
    history.push(`/apps/peka?${e.label.length === 5 ? "motif" : "rbp"}=${e.label}`)
  }

  return (
    <Base className="peka-page">
      <h1>PEKA</h1>
      <Select
        options={searchData}
        menuIsOpen={searchTerm.length >= 2}
        onInputChange={value => setSearchTerm(value)}
        onChange={searchSelected}
      />
      <p className="peka-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque modi natus laborum quisquam, quam exercitationem vel voluptates reiciendis tempora amet, illum autem molestias? Fuga qui eligendi voluptatem nisi, incidunt dicta!</p>
      {rbp ? <PekaRbp rbp={rbp} /> : <PekaHeatmap /> }
    </Base>
  )
};

PekaPage.propTypes = {
    
};

export default PekaPage;