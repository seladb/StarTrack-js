import ReactGA from 'react-ga';

function initializeGoogleAnalytics() {
    ReactGA.initialize("UA-104097715-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
}

export default initializeGoogleAnalytics;