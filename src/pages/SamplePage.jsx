import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { SAMPLE } from "../queries";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import SampleInfo from "../components/SampleInfo";

const SamplePage = () => {
  const sampleId = useRouteMatch("/samples/:id").params.id;

  const { loading, data, error } = useQuery(SAMPLE, {
    variables: {id: sampleId}
  });

  useEffect(() => {
    document.title = `iMaps${data && data.sample ? " - " + data.sample.name : ""}`;
  });

  if ((error && error.graphQLErrors && error.graphQLErrors.length)) {
    const message = JSON.parse(error.graphQLErrors[0].message);
    if (message && Object.values(message).some(m => m === "Does not exist")) {
      return <PageNotFound />
    }
  }

  if (loading) {
    return <Base className="sample-page" loading={true} />
  }

  const sample = data.sample;

  return (
    <Base className="sample-page">
      <SampleInfo sample={sample} />
    </Base>
  );
};

SamplePage.propTypes = {
  
};

export default SamplePage;