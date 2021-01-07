const core = require('@actions/core');
const github = require('@actions/github');
const { context } = require("@actions/github");
const { sendReviewer, sendComment } = require('./modules/github');
const { REVIEW_REQUESTED, COMMENT_CRETED, COMMENT_EDITED } = require("./constants");

const app = async () => {
  try {
    const { action } = context.payload;
    // const githubToken = core.getInput('github-token');
    // const githubRunId = core.getInput('github-run-id');

    let userData = core.getInput('user-data');
    userData = JSON.parse(userData)

    if (action === REVIEW_REQUESTED) {
      sendReviewer({ userData, payload });
    }
    else if (payload.action === COMMENT_CRETED || payload.action === COMMENT_EDITED) {
      sendComment({ userData, payload })
    }

  } catch (error) {
    core.setFailed(error);
  }
}

app()