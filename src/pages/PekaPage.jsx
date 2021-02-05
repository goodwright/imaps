import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PekaHeatmap from "../components/PekaHeatmap";
import PekaRbp from "../components/PekaRbp";
import Base from "./Base";

const PekaPage = () => {

  // What arguments are there?
  const params = new URLSearchParams(useLocation().search);
  const rbp = params.get("rbp");
  const sequence = params.get("sequence");

  useEffect(() => {
    document.title = `iMaps - ${rbp || ""} PEKA`;
  });

  return (
    <Base className="peka-page">
      <h1>PEKA</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque modi natus laborum quisquam, quam exercitationem vel voluptates reiciendis tempora amet, illum autem molestias? Fuga qui eligendi voluptatem nisi, incidunt dicta!</p>
      {rbp ? <PekaRbp rbp={rbp} /> : <PekaHeatmap /> }
    </Base>
  )
};

PekaPage.propTypes = {
    
};

export default PekaPage;