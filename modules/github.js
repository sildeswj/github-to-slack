const { sendNotification } = require("./slack");

export const sendReviewer = async ({ userData, payload, header }) => {
  try {
    const pullRequest = payload.pull_request;
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
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": header,
              "emoji": true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `주인장: <@${requestedBy}>\n리뷰 하실 분: ${slackUserIds.join('')}\nURL: ${pullRequest.html_url}`
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
      const result = await sendNotification({ params })
      return result
    } else return true
  } catch (err) {
    throw new Error(err)
  }
}

export const sendComment = async ({ userData, payload }) => {
  try {
    const { comment } = payload;
    const pullRequest = payload.pull_request;
    const requestedBy = userData[pullRequest.user.login]
    let commentBy = comment.user
    commentBy = userData[commentBy]

    const contents = "```" + comment.body + "```"
    const params = {
      text: "",
      blocks: [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "코멘트 도착 💪",
            "emoji": true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `주인장: <@${requestedBy}>\nURL: ${comment.html_url}`
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
    const result = await sendNotification({ params })
    return result
  } catch (err) {
    throw new Error(err)
  }
}

export const sendClosed = async ({ userData, payload }) => {
  try {
    const pullRequest = payload.pull_request;
    const requestedBy = userData[pullRequest.user.login]

    // pull request merged to develop
    if (pullRequest.base.ref === 'develop') {
      const params = {
        text: "",
        blocks: [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "스테이징에 새로운 기능이 올라갔어요 🥳",
              "emoji": true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `주인장: <@${requestedBy}>`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: pullRequest.body
            }
          },
          {
            "type": "divider"
          }
        ]
      }
      const result = await sendNotification({ params })
      return result
    }
    // pull request merged to master
    else if (pullRequest.base.ref === 'master') {
      return true
    }

    return true

  } catch (err) {
    throw new Error(err)
  }
}