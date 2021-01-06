import { context } from "@actions/github";
import { REVIEW_REQUESTED } from "./constants";

export const getReviewer = async () => {
  // console.log('context: ', context);
  // console.log('payload: ', context.payload);
  // console.log('pull_request: ', context.payload.pull_request);

  const { payload } = context
  if (payload.action === REVIEW_REQUESTED) {
    const pullRequest = context.payload.pull_request;
    if (pullRequest && pullRequest.requested_reviewers) {
      const reviewers = pullRequest.requested_reviewers;
      console.log('reviewers: ', reviewers);
      return true
    }
  }
  return true;
}