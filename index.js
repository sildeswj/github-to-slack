const core = require('@actions/core');
const github = require('@actions/github');
const { context } = require("@actions/github");
const { sendReviewer, sendComment, sendClosed } = require('./modules/github');
const { REVIEW_REQUESTED, SYNCHRONIZE, COMMENT_CRETED, COMMENT_EDITED, PULL_REQUEST_CLOSED } = require("./modules/constants");

const app = async () => {
  try {
    const { payload } = context;
    // const githubToken = core.getInput('github-token');
    // const githubRunId = core.getInput('github-run-id');

    let userData = core.getInput('user-data');
    userData = JSON.parse(userData)

    if (payload.action === REVIEW_REQUESTED || payload.action === SYNCHRONIZE) {
      const header = payload.action === SYNCHRONIZE ? '다시 해주세요 🔫' : '리뷰 해주세요 🎁'
      sendReviewer({ userData, payload, header });
    }
    else if (payload.action === COMMENT_CRETED || payload.action === COMMENT_EDITED) {
      sendComment({ userData, payload })
    }
    else if (payload.action === PULL_REQUEST_CLOSED) {

    }
    else {
      console.log('payload: ', payload);
    }

  } catch (error) {
    core.setFailed(error);
  }
}

app()