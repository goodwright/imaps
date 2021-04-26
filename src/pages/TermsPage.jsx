import React, { useState, useEffect }  from "react";
import useDocumentTitle from "@rehooks/document-title";
import Base from "./Base";
import Document from "../components/Document";
import terms from "../documents/terms.md";

const TermsPage = () => {
    
  const [markdown, setMarkdown] = useState(null);

  useDocumentTitle("iMaps - Terms of Use");

  useEffect(() => {
    fetch(terms).then(res => res.text()).then(text => setMarkdown(text));
  }, []);

  return (
    <Base className="terms-page" blank={true}>
      <Document markdown={markdown} />
    </Base>
  );
};

TermsPage.propTypes = {
    
};

export default TermsPage;