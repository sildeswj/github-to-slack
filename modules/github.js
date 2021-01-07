const { context } = require("@actions/github");
const { REVIEW_REQUESTED, COMMENT_CRETED, COMMENT_EDITED } = require("./constants");
const { send } = require("./slack");

export const getReviewer = async ({ userData }) => {
  try {
    const { payload } = context
    if (payload.action === REVIEW_REQUESTED) {
      const pullRequest = context.payload.pull_request;
      if (pullRequest && pullRequest.requested_reviewers) {
        const reviewers = pullRequest.requested_reviewers;
        const slackUserIds = reviewers.map(reviewer => {
          const reviewerId = reviewer.login
          const slackId = userData[reviewerId]
          return `<@${slackId}>`
        })
        const requestedBy = userData[pullRequest.user.login]
        const contents = "```" + pullRequest.body + "```"
        const params = {
          slackUserIds,
          text: "",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Requested by: <@${requestedBy}>\nReviewers: ${slackUserIds.join('')}\nURL: ${pullRequest.html_url}`
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: contents
              }
            },
            {
              "type": "divider"
            }
          ]
        }
        const result = await send({ params })
        return result
      } else return true
    }
    else if (payload.action === COMMENT_CRETED || payload.action === COMMENT_EDITED) {
      const { comment } = context.payload;

      let commentBy = comment.user
      commentBy = userData[commentBy]

      const contents = "```" + comment.body + "```"
      const params = {
        text: "",
        blocks: [
          // {
          //   type: "section",
          //   text: {
          //     type: "mrkdwn",
          //     text: `Requested by: <@${requestedBy}>\nReviewers: <@${commentBy}>\nURL: ${pullRequest.html_url}`
          //   }
          // },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: contents
            }
          },
          {
            "type": "divider"
          }
        ]
      }
      const result = await send({ params })
      return result
    }
    else return true;
  } catch (err) {
    throw new Error(err)
  }
}