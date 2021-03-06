// index.js

const core = require('@actions/core');
const { context, getOctokit } = require("@actions/github");
const { sendReviewer, sendComment, sendToMaster, sendToDevelop } = require('./modules/github');
const { REVIEW_REQUESTED, SYNCHRONIZE, COMMENT_CRETED, COMMENT_EDITED, MASTER_BRANCH, DEVELOP_BRANCH } = require("./modules/constants");

const app = async () => {
  try {
    const { payload } = context;
    const githubToken = core.getInput('github-token');
    const octokit = getOctokit(githubToken);

    let userData = core.getInput('user-data');
    userData = JSON.parse(userData)

    if (payload.action === REVIEW_REQUESTED || payload.action === SYNCHRONIZE) {
      const header = payload.action === SYNCHRONIZE ? '다시 해주세요 🔫' : '리뷰 해주세요 🎁'
      sendReviewer({ userData, payload, header });
    }
    else if (payload.action === COMMENT_CRETED || payload.action === COMMENT_EDITED) {
      sendComment({ userData, payload })
    }
    // push event
    else if (payload.pusher) {
      if (payload.ref === DEVELOP_BRANCH) sendToDevelop({ userData, octokit, context })
      else if (payload.ref === MASTER_BRANCH) sendToMaster({ userData, octokit, context })
      else true;
    }
    else {
      return true;
    }
  } catch (error) {
    console.log('error: ', error);
    core.setFailed(error);
  }
}

app()