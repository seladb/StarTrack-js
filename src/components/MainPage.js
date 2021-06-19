import React from "react";
import PropTypes from "prop-types";
import TopNav from "./TopNav";
import MainContainer from "./MainContainer";

const MainPage = (props) => {
  return (
    <div>
      <TopNav />
      <MainContainer preloadedRepos={props.preloadedRepos} />
    </div>
  );
};
MainPage.propTypes = {
  preloadedRepos: PropTypes.object,
};

export default MainPage;
