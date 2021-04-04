import React, { useEffect } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SAMPLE } from "../queries";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import SampleInfo from "../components/SampleInfo";
import ExecutionHistory from "../components/ExecutionHistory";

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
      <h2>Analysis History</h2>
      <p className="info">A list of the analysis commands run on data in this sample.</p>
      <ExecutionHistory executions={sample.executions} />
      {sample.owners.length > 0 && <div className="owner">
        Contributed by <div className="names">{sample.owners.map(user => <Link key={user.id} to={`/users/${user.username}/`}>{user.name}</Link>)}</div> 
      </div>}
    </Base>
  );
};

SamplePage.propTypes = {
  
};

export default SamplePage;