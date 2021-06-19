import React from "react";
import PropTypes from "prop-types";
import TopNav from "./TopNav";
import MainContainer from "./MainContainer";

export default function MainPage({ preloadedRepos }) {
  return (
    <div>
      <TopNav />
      <MainContainer preloadedRepos={preloadedRepos} />
    </div>
  );
}
MainPage.propTypes = {
  preloadedRepos: PropTypes.object,
};
