const core = require('@actions/core');
const axios = require('axios');

export const sendNotification = async ({ params }) => {
  try {
    const slackWebhookUrl = core.getInput('slack-webhook-url');
    console.log('slackWebhookUrl: ', slackWebhookUrl);
    const result = await axios.post(slackWebhookUrl, JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    });
    return result;
  } catch (err) {
    console.log('debug: ', err);
    throw new Error(err)
  }
}