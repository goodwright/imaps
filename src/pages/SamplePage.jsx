import React, { useContext } from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { SAMPLE } from "../queries";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import SampleInfo from "../components/SampleInfo";
import ExecutionHistory from "../components/ExecutionHistory";
import { detect404 } from "../forms";
import { UserContext } from "../contexts";
import SampleDeletion from "../components/SampleDeletion";

const SamplePage = props => {
  const sampleId = useRouteMatch("/samples/:id").params.id;
  const { edit } = props;
  const [user,] = useContext(UserContext);

  const { loading, data, error } = useQuery(SAMPLE, {
    variables: {id: sampleId}
  });

  useDocumentTitle(data ? `iMaps - ${data.sample.name}` : "iMaps");

  if (detect404(error)) return <PageNotFound />

  if (loading) {
    return <Base className="sample-page" loading={true} />
  }

  const sample = data.sample;

  if (user && edit && !sample.canEdit) return <PageNotFound />

  return (
    <Base className="sample-page">
      <SampleInfo sample={sample} edit={edit} collections={data.user.ownedCollections} />
      {!edit && (
        <>
          <h2>Analysis History</h2>
          <p className="info">A list of the analysis commands run on data in this sample.</p>
          <ExecutionHistory executions={sample.executions} />
        </>
      )}
      {edit && sample.canShare && <div className="bottom-buttons">
        {edit && sample.isOwner && <SampleDeletion sample={sample} />}
      </div>}
    </Base>
  );
};

SamplePage.propTypes = {
  
};

export default SamplePage;