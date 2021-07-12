import React from "react";
import { useDocumentTitle } from "../hooks";
import Base from "./Base";

const HomePage = () => {

  useDocumentTitle("iMaps");
  
  return (
    <Base>
      <div className="grid gap-3 max-w-4xl">
        <p>Welcome to iMaps v2. This platform is the successor to our <a href="https://imaps.genialis.com/iclip">iMaps v1</a> CLIP-analysis platform run by Genialis, which will continue to operate with full functionality until the end of September 2021. At that point, all data will be transferred to iMaps v2, and therefore we recommend you continue to use iMaps v1 for now. For its use, please read the iMaps v1 <a href="https://drive.google.com/file/d/1Te-RgqiIOFsVKAqWW6xBPLf8sFCuvUoo/view">documentation</a> and <a href="https://drive.google.com/file/d/1cdLPCJ7xdxOgFJKij8nhIgwrxqQv64oa/view">tutorial</a>.</p>
        <p>iMaps v2 is currently under active development, and to get a sense of how it works you can: log in, manage your account and groups, view, search and download publicly available data. The functionality to run new analyses will be implemented by September.</p>
        <p>The backend of iMaps v2 will be based on our newly released Nextflow <a href="https://nf-co.re/clipseq/1.0.0">nf-core/clipseq</a> pipeline. This will 1) unify analyses performed on iMaps and at the command line to improve reproducibility, 2) make our backend pipeline code easily accessible so that users can comment or contribute to the pipeline itself. In addition, we have created <a href="https://join.slack.com/t/imapsgroup/shared_invite/zt-r24y3591-Xbhnym2t38u_urU~I0K0lQ">a Slack workspace</a> so that users can ask questions about CLIP and its analysis, make suggestions and get the latest updates from the developers. Representative Q{"&"}A are also collated on our <a href="https://docs.imaps.goodwright.org/">CLIP Forum</a>.</p>
        <p>Our vision for iMaps v2 is that we will regularly increase the number of available tools by including new relevant software developed by us or others, and also introduce interactive visualisations to help you to better explore data, alongside functionalities for cross-dataset meta-analyses.</p>
      </div>
    </Base>
  );
};

HomePage.propTypes = {
    
};

export default HomePage;