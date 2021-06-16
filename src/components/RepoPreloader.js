import React, { useState, useEffect, useRef } from 'react'
import { Container, ProgressBar, Button } from 'react-bootstrap/'
import './RepoPreloader.css'
import stargazerLoader, { maxReposAllowed } from '../utils/StargazerLoader'
import MainPage from './MainPage'

const RepoPreloader = (props) => {

  const parseUrlParams = () => {
    let searchParams = new URLSearchParams(props.location.search);
    let result = [];
    searchParams.forEach( (value, key) => {
      if (key === "r") {
        let repo = value.split(",");
        if (result.length < maxReposAllowed &&
            repo.length === 2 && 
            result.find(iter => iter.username === repo[0] && iter.repo === repo[1]) === undefined) {
          result.push({
            username: repo[0],
            repo: repo[1]
          })
        }
      }
    })
    return result;
  }

  const reposToPreload = useRef();
  const currentlyLoadingIndex = useRef();

  const [loadProgress, setLoadProgress] = useState(0);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [reposLoaded, setReposLoaded] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleButtonClick = () => {
    setErrors([]);
  }

  const getProgressBarVariant = () => {
    if (finishedLoading && errors.length > 0) {
      return "warning"
    }
    
    return "success"
  }

  const getSecondaryHeaderMessage = () => {
    if (finishedLoading && errors.length > 0) {
      return "Error loading repos"
    }

    if (reposToPreload.current === undefined) {
      return ""
    }

    return reposToPreload.current[currentlyLoadingIndex.current].username + "/" + reposToPreload.current[currentlyLoadingIndex.current].repo;
  }

  const loadStargazers = async () => {
    let repoToPreload = reposToPreload.current[currentlyLoadingIndex.current];

    try {
      let stargazerData = await stargazerLoader.loadStargazers(
        repoToPreload.username,
        repoToPreload.repo,
        null,
        (progress) => setLoadProgress(progress),
        () => false);

      setReposLoaded([...reposLoaded, stargazerData]);
    }
    catch(error) {
      setErrors([...errors, { repoDetails: repoToPreload, message: error.message }]);
    }

    currentlyLoadingIndex.current = currentlyLoadingIndex.current + 1;
  }

  useEffect(() => {
    reposToPreload.current = parseUrlParams();
    if (reposToPreload.current.length > 0) {
      currentlyLoadingIndex.current = 0;
      loadStargazers();
    }
    else {
      setFinishedLoading(true);
      setLoadProgress(100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reposLoaded.length > 0 || errors.length > 0) {
      if (currentlyLoadingIndex.current < reposToPreload.current.length) {
        loadStargazers();
      }
      else {
        setFinishedLoading(true);
        setLoadProgress(100);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reposLoaded, errors]);

  return (
    <div>
      { finishedLoading === false || errors.length > 0 ? 
        <Container className="RepoPreloader-topContainer">
          <h3 >Loading Repos Data...</h3>
          <h5>{getSecondaryHeaderMessage()}</h5>
          <ProgressBar className="RepoPreloader-ProgressBar-Reseting" now={loadProgress} variant={getProgressBarVariant()} animated />
          { errors.length > 0 ?
          <Container className="RepoPreloader-errorContainer">
            {errors.map(error => <h6><b>Error loading {error.repoDetails.username}/{error.repoDetails.repo}:</b> {error.message}</h6>)}
            {finishedLoading ? <Button onClick={handleButtonClick}>Continue</Button> : null }
          </Container>
          : null }
        </Container> 
      :
        <MainPage preloadedRepos={reposLoaded}/>
      }
    </div>
  )

}

export default RepoPreloader