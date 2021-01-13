const core = require('@actions/core');
// const github = require("@actions/github");
import * as github from '@actions/github'
import { GitHub, getOctokitOptions } from '@actions/github/lib/utils'

const { context } = require("@actions/github");
// const { Octokit } = require("@octokit/rest");

// const githubToken = core.getInput('github-token');
// const octokit = new github.GitHub(githubToken);

const { sendReviewer, sendComment, sendClosed } = require('./modules/github');
const { REVIEW_REQUESTED, SYNCHRONIZE, COMMENT_CRETED, COMMENT_EDITED, PULL_REQUEST_CLOSED } = require("./modules/constants");

const app = async () => {
  try {
    const { payload } = context;
    // const githubRunId = core.getInput('github-run-id');

    const githubToken = core.getInput('github-token');
    // let sha = core.getInput('sha');
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
      sendClosed({ userData, payload })
    }
    else {
      // console.log('payload00: ', payload);
      const octokit = new GitHub(githubToken);

      // console.log('octokit.repos: ', octokit.repos);
      console.log('context: ', context);

      // const result = await octokit.repos.listPullRequestsAssociatedWithCommit({
      //   owner: context.repo.owner,
      //   repo: context.repo.repo,
      //   commit_sha: context.sha,
      // });

      const { headers } = await octokit.request('/')
      console.log(`headers: `, headers)

      const result = await octokit.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: 24,
      });
      console.log('result: ', result);
      return true;
    }
  } catch (error) {
    console.log('error: ', error);
    core.setFailed(error);
  }
}

app()