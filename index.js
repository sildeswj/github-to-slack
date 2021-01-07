const core = require('@actions/core');
const github = require('@actions/github');
const { getReviewer } = require('./modules/github');

const app = async () => {
  try {
    // const githubToken = core.getInput('github-token');
    // const githubRunId = core.getInput('github-run-id');
    let userData = core.getInput('user-data');
    userData = JSON.parse(userData)
    getReviewer({ userData });
  } catch (error) {
    core.setFailed(error);
  }
}

app()