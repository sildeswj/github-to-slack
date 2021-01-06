import { context } from "@actions/github";

exports.getReviewer = async () => {
  console.log('context: ', context);
  return true;
}