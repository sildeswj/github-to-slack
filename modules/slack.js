const core = require('@actions/core');
const axios = require('axios');

export const sendNotification = async ({ params, toWhere = 'normal' }) => {
  try {
    console.log('toWhere: ', toWhere);
    let slackWebhookUrl = core.getInput('slack-webhook-url')
    if (toWhere === 'staging') core.getInput('staging-webhook-url');
    if (toWhere === 'production') core.getInput('production-webhook-url');
    const result = await axios.post(slackWebhookUrl, JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    });
    return result;
  } catch (err) {
    console.log('debug: ', err);
    throw new Error(err)
  }
}