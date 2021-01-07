const { context } = require("@actions/github");
const { REVIEW_REQUESTED } = require("./constants");
const { send } = require("./slack");

export const getReviewer = async ({ userData }) => {
  try {
    // console.log('context: ', context);
    // console.log('payload: ', context.payload);
    // console.log('pull_request: ', context.payload.pull_request);

    const { payload } = context
    if (payload.action === REVIEW_REQUESTED) {
      const pullRequest = context.payload.pull_request;
      if (pullRequest && pullRequest.requested_reviewers) {
        console.log('payload: ', payload);
        const reviewers = ["U0172A51T4N", "U01DV0WFDCL"];
        // const reviewers = pullRequest.requested_reviewers;
        console.log('reviewers: ', reviewers);
        console.log('userData: ', userData);
        console.log('me: ', userData.sildeswj);
        const slackUserIds = reviewers.map(reviewer => {
          const reviewerId = reviewer.login
          const slackId = userData[reviewerId]
          return `<@${slackId}>`
        })
        const requestedBy = userData[pullRequest.user.login]
        const text = `
          Requested by: <${requestedBy}>
          Reviewers: ${slackUserIds.join('')}
          URL: ${pullRequest.html_url}
          Contents:
          ${pullRequest.body}
        `
        const params = {
          slackUserIds,
          text: text
        }
        const result = await send({ params })
        return result
      }
    }
    else return true;
  } catch (err) {
    throw new Error(err)
  }
}