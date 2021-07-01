import React, { useState, useEffect }  from "react";
import PropTypes from "prop-types";
import useDocumentTitle from "@rehooks/document-title";
import Base from "./Base";
import ReactMarkdown from "react-markdown";

const DocumentPage = props => {

  const { document, title } = props;
  const [markdown, setMarkdown] = useState(null);

  useDocumentTitle(`iMaps - ${title}`);

  useEffect(() => {
    fetch(document).then(res => res.text()).then(text => setMarkdown(text));
  }, [document]);

  const CustomParagraph = ({ children }) => <p className="font-light mb-3">{children}</p>
  const CustomH2 = ({ children, level }) => {
    const Element = `h${level}`;
    if (level === 2) {
      return <Element className="text-xl mb-1 sm:mb-2 sm:text-2xl md:mb-3 md:text-3xl">{children}</Element>
    } else {
      return <Element>{children}</Element>
    }
  }

  if (!markdown) {
    return <Base loading={true} />
  }

  return (
    <Base>
      <ReactMarkdown
        source={markdown}
        renderers={{
          paragraph: (props) => <CustomParagraph {...props} />,
          heading: (props) => <CustomH2 {...props} />,
        }}
      />
    </Base>
  );
};

DocumentPage.propTypes = {
    document: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default DocumentPage;