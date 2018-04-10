import React from "react";
import Masthead from "../components/MastHead";
require("prismjs/themes/prism-tomorrow.css");

class Template extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <Masthead />
        <div css={{ margin: "0 2rem" }}>{children()}</div>
      </div>
    );
  }
}

export default Template;
