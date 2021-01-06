import { context } from "@actions/github";

export const getReviewer = async () => {
  console.log('context: ', context);
  console.log('payload: ', context.payload);
  console.log('pull_request: ', context.payload.pull_request);
  // const { Context } = context
  // console.log('Context: ', Context);
  return true;
}