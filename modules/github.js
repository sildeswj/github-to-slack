import { context } from "@actions/github";

export const getReviewer = async () => {
  // console.log('context: ', context);
  const { Context } = context
  console.log('debug: ', Context.pull_request.requested_reviewers);
  return true;
}