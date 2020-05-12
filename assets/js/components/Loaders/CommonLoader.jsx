import React from "react";
import ContentLoader from "react-content-loader";

const CommonLoader = (props) => {
  return (
    <ContentLoader
      viewBox="0 0 400 160"
      height={160}
      width={400}
      speed={2}
      backgroundColor="transparent"
      {...props}
    >
      <circle cx="150" cy="86" r="8" />
      <circle cx="194" cy="86" r="8" />
      <circle cx="238" cy="86" r="8" />
    </ContentLoader>
  );
};

CommonLoader.metadata = {
  name: "RioF",
  github: "clariokids",
  description: "Three Dots",
  filename: "ThreeDots",
};

export default CommonLoader;