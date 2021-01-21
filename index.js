const core = require('@actions/core');
import * as github from '@actions/github'
const { context } = require("@actions/github");

const { sendReviewer, sendComment, sendMerged, sendToMaster } = require('./modules/github');
const { REVIEW_REQUESTED, SYNCHRONIZE, COMMENT_CRETED, COMMENT_EDITED, PULL_REQUEST_MERGED, MASTER_BRANCH } = require("./modules/constants");

const app = async () => {
  try {
    const { payload } = context;
    // const githubRunId = core.getInput('github-run-id');

    const githubToken = core.getInput('github-token');
    const octokit = github.getOctokit(githubToken);

    let userData = core.getInput('user-data');
    userData = JSON.parse(userData)

    console.log('payload.action: ', payload.action);

    if (payload.action === REVIEW_REQUESTED || payload.action === SYNCHRONIZE) {
      const header = payload.action === SYNCHRONIZE ? '다시 해주세요 🔫' : '리뷰 해주세요 🎁'
      sendReviewer({ userData, payload, header });
    }
    else if (payload.action === COMMENT_CRETED || payload.action === COMMENT_EDITED) {
      sendComment({ userData, payload })
    }
    else if (payload.action === PULL_REQUEST_MERGED) {
      sendMerged({ userData, payload, octokit, context })
    }
    // push event
    else if (payload.pusher && payload.ref === MASTER_BRANCH) {
      sendToMaster({ userData, octokit, context })
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