import React, { useContext, useState } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { UserContext } from "../contexts";
import { COLLECTION } from "../queries";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import SamplesTable from "../components/SamplesTable";
import ExecutionTable from "../components/ExecutionTable";
import CollectionDeletion from "../components/CollectionDeletion";
import CollectionAccess from "../components/CollectionAccess";
import { detect404 } from "../forms";
import CollectionInfo from "../components/CollectionInfo";
import PapersList from "../components/PapersList";

const CollectionPage = props => {
  
  const { edit } = props;
  const collectionId = useRouteMatch("/collections/:id").params.id;
  const [user,] = useContext(UserContext);
  const [papers, setPapers] = useState(null);

  const { loading, data, error } = useQuery(COLLECTION, {variables: {id: collectionId}});

  useDocumentTitle(data ? `iMaps - ${data.collection.name}` : "iMaps");

  if (detect404(error)) return <PageNotFound />

  if (loading) return <Base loading={true} />

  const collection = data.collection;

  if (user && edit && !collection.canEdit) return <PageNotFound />

  const actualPapers = papers ? papers.filter(
    paper => paper.year || paper.title || paper.url
  ) : collection.papers.map(paper => ({...paper}));

  const h2Class = "text-primary-200 text-xl mb-2";

  return (
    <Base>
      <div className="grid gap-5 2xl:flex items-start justify-between mb-12 pb-6 border-b 2xl:border-b-0 2xl:pb-0">
        <CollectionInfo
          collection={collection} editing={edit}
          papers={actualPapers.map(paper => ({year: paper.year, url: paper.url, title: paper.title}))}
          className="mb-0 2xl:mr-6"
        />
        <PapersList papers={actualPapers} setPapers={edit ? setPapers : null} />
      </div>

      {!edit && (
        <div className="w-full flex flex-wrap mb-10">
          <div className="w-max max-w-full block mr-16 mb-10">
            <h2 className={h2Class}>Samples</h2>
            <SamplesTable
              samples={[...collection.samples].sort(e => -e.created)}
              noMessage="No samples yet."
            />
          </div>
          <div className="w-max max-w-full block">
            <h2 className={h2Class}>Analysis History</h2>
            <ExecutionTable
              executions={[...collection.executions].sort(e => -e.created)}
              noMessage="No analysis yet."
              showCategory={true}
            />
          </div>
        </div>
      )}

      {!edit && collection.owners.length > 0 && (
        <div className="ml-auto w-max text-right flex text-base md:text-lg">
          Contributed by
          <div className="grid ml-2 font-medium">
            {collection.owners.map(user => <Link key={user.id} to={`/users/${user.username}/`}>{user.name}</Link>)}
          </div> 
        </div>
      )}

      {edit && collection.canShare && <div className="btn-box ml-auto">
        <CollectionAccess collection={collection} allUsers={data.users} allGroups={data.groups}/>
        {edit && collection.isOwner && <CollectionDeletion collection={collection} />}
      </div>}
    </Base>
  );
};

CollectionPage.propTypes = {

};

export default CollectionPage;