import React, { useState, useEffect }  from "react";
import Base from "./Base";
import Document from "../components/Document";
import privacy from "../documents/privacy.md";

const PrivacyPolicyPage = props => {

  const [markdown, setMarkdown] = useState(null);

  useEffect(() => {
    fetch(privacy).then(res => res.text()).then(text => setMarkdown(text));
  });

  return (
    <Base className="privacy-policy-page" blank={true}>
      <Document markdown={markdown} />
    </Base>
  );
};

PrivacyPolicyPage.propTypes = {
    
};

export default PrivacyPolicyPage;