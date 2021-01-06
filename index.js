const core = require('@actions/core');
const github = require('@actions/github');
const { getReviewer } = require('./modules/github');

const app = async () => {
  try {
    const githubToken = core.getInput('github-token');
    const slackWebhookUrl = core.getInput('slack-webhook-url');
    const githubRunId = core.getInput('github-run-id');
    let userData = core.getInput('user-data');
    const userData2 = core.getInput('user-data2');

    console.log(`Input values ${githubToken}, ${slackWebhookUrl}, ${githubRunId}, ${userData}, ${userData2}!`);
    const result = `${githubToken}, ${slackWebhookUrl}, ${githubRunId}`

    userData = JSON.parse(userData)
    getReviewer({ userData });
    // Get the JSON webhook payload for the event that triggered the workflow.
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

app()