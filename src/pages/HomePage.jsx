import React, { useEffect } from "react";
import Base from "./Base";

const HomePage = () => {

  useEffect(() => {
    document.title = "iMaps";
  });

  return (
    <Base className="home-page">
      iMaps
    </Base>
  );
};

HomePage.propTypes = {
    
};

export default HomePage;