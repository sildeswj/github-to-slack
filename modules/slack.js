const core = require('@actions/core');
const axios = require('axios');

// TODO (@jay): add slack send 
export const send = async ({ params }) => {
  try {
    const slackWebhookUrl = core.getInput('slack-webhook-url');
    console.log('slackWebhookUrl: ', slackWebhookUrl);
    const result = await axios.post(slackWebhookUrl, JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    });
    return result;
  } catch (err) {
    console.log('debug: ', err);
    throw 'error'
    // throw new Error(err)
  }
}