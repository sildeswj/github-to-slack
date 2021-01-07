// import core from '@actions/core';
import axios from 'axios';

// TODO (@jay): add slack send 
export const send = async ({ slackWebhookUrl, params }) => {
  try {
    // const slackWebhookUrl = core.getInput('slack-webhook-url');
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