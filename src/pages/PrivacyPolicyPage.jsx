import React, { useState, useEffect }  from "react";
import useDocumentTitle from "@rehooks/document-title";
import Base from "./Base";
import Document from "../components/Document";
import privacy from "../documents/privacy.md";

const PrivacyPolicyPage = () => {

  const [markdown, setMarkdown] = useState(null);

  useDocumentTitle("iMaps - Privacy Policy");

  useEffect(() => {
    fetch(privacy).then(res => res.text()).then(text => setMarkdown(text));
  }, []);

  return (
    <Base className="privacy-policy-page" blank={true}>
      <Document markdown={markdown} />
    </Base>
  );
};

PrivacyPolicyPage.propTypes = {
    
};

export default PrivacyPolicyPage;