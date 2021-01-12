const core = require('@actions/core');
const axios = require('axios');

export const sendNotification = async ({ params, toWhere = 'normal' }) => {
  try {
    const slackWebhookUrl = toWhere === 'normal' ? core.getInput('slack-webhook-url') : core.getInput('staging-webhook-url');
    const result = await axios.post(slackWebhookUrl, JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    });
    return result;
  } catch (err) {
    console.log('debug: ', err);
    throw new Error(err)
  }
}