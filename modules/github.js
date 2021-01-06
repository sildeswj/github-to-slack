import { context } from "@actions/github";

export const getReviewer = async () => {
  console.log('context: ', context);
  return true;
}