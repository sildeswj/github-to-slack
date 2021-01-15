const core = require('@actions/core');
import * as github from '@actions/github'
const { context } = require("@actions/github");

const { sendReviewer, sendComment, sendClosed } = require('./modules/github');
const { REVIEW_REQUESTED, SYNCHRONIZE, COMMENT_CRETED, COMMENT_EDITED, PULL_REQUEST_CLOSED, PUSH } = require("./modules/constants");

const app = async () => {
  try {
    const { payload } = context;
    // const githubRunId = core.getInput('github-run-id');

    const githubToken = core.getInput('github-token');
    const octokit = github.getOctokit(githubToken);

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
      sendClosed({ userData, payload, octokit, context })
    }
    else {

      console.log('payload.action: ', payload);

      let commits = payload.commits
      commits = commits.filter(commit => commit.committer.username === 'web-flow')

      const responseAll = commits.map(async commit => {
        return octokit.repos.listPullRequestsAssociatedWithCommit({
          owner: context.repo.owner,
          repo: context.repo.repo,
          commit_sha: commit.id,
        });
      })

      let pullRequests = await Promise.all(responseAll)

      const result = pullRequests.map(pullRequest => {
        const data = pullRequest.data
        return data[0]
      })
      console.log('result: ', result);
      return true;
    }
  } catch (error) {
    console.log('error: ', error);
    core.setFailed(error);
  }
}

app()