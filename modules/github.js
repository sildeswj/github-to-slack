import { context } from "@actions/github";

export const getReviewer = async () => {
  // console.log('context: ', context);
  const { Context } = context
  console.log('Context: ', Context);
  return true;
}