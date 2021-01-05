const core = require('@actions/core');
const github = require('@actions/github');
const { getDataFromUser } = require('./data/controller');

const app = async () => {
  try {
    const githubToken = core.getInput('github-token');
    const slackWebhookUrl = core.getInput('slack-webhook-url');
    const githubRunId = core.getInput('github-run-id')

    console.log(`Input values ${githubToken}, ${slackWebhookUrl}, ${githubRunId}!`);
    const result = `${githubToken}, ${slackWebhookUrl}, ${githubRunId}`
    core.setOutput("result", result);
    // Get the JSON webhook payload for the event that triggered the workflow.
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

app()