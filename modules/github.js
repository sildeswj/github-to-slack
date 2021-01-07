import { context } from "@actions/github";
import { REVIEW_REQUESTED } from "./constants";
import { send } from "./slack";

export const getReviewer = async ({ userData }) => {
  // console.log('context: ', context);
  // console.log('payload: ', context.payload);
  // console.log('pull_request: ', context.payload.pull_request);

  const { payload } = context
  if (payload.action === REVIEW_REQUESTED) {
    const pullRequest = context.payload.pull_request;
    if (pullRequest && pullRequest.requested_reviewers) {
      const reviewers = pullRequest.requested_reviewers;
      console.log('reviewers: ', reviewers);
      console.log('userData: ', userData);
      console.log('me: ', userData.sildeswj);
      const slackUserIds = reviewers.map(reviewer => {
        const reviewerId = reviewer.login
        const slackId = userData[reviewerId]
        return slackId
      })
      const params = {
        slackUserIds,
      }
      const result = await send(params)
      return result
    }
  }
  else return true;
}