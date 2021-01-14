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

export const sendToStaging = async ({ userData, pullRequest }) => {
  const requestedBy = userData[pullRequest.user.login]

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
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "5분 정도 뒤에 확인해주세요.",
            "emoji": true
          }
        ]
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
  const toWhere = 'staging'
  const result = await sendNotification({ params, toWhere })
  return result
}

export const sendToMaster = async ({ userData, pullRequest, payload, octokit, context }) => {
  console.log('sendToMaster: ', payload);

  const result = await octokit.repos.listPullRequestsAssociatedWithCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    // commit_sha: context.sha
    commit_sha: '1e70279a127966f28ccc4df2c4cb4d57f71b7689'
    // commit_sha: '859e1bbfaf6abe2dcaf4c2a0edd006489e78c46e'
  });

  console.log('result: ', result);
  return true;
  // const requestedBy = userData[pullRequest.user.login]

  // const params = {
  //   text: "",
  //   blocks: [
  //     {
  //       "type": "header",
  //       "text": {
  //         "type": "plain_text",
  //         "text": "스테이징에 새로운 기능이 올라갔어요 🥳",
  //         "emoji": true
  //       }
  //     },
  //     {
  //       "type": "context",
  //       "elements": [
  //         {
  //           "type": "plain_text",
  //           "text": "5분 정도 뒤에 확인해주세요.",
  //           "emoji": true
  //         }
  //       ]
  //     },
  //     {
  //       type: "section",
  //       text: {
  //         type: "mrkdwn",
  //         text: `주인장: <@${requestedBy}>`
  //       }
  //     },
  //     {
  //       type: "section",
  //       text: {
  //         type: "mrkdwn",
  //         text: pullRequest.body
  //       }
  //     },
  //     {
  //       "type": "divider"
  //     }
  //   ]
  // }
  // const toWhere = 'normal'
  // const result = await sendNotification({ params, toWhere })
  // return result
}

export const sendClosed = async ({ userData, payload, octokit, context }) => {
  try {
    const pullRequest = payload.pull_request;

    switch (pullRequest.base.ref) {
      // pull request merged to develop
      case 'develop':
        sendToStaging({ userData, pullRequest })
        break;
      // pull request merged to master
      case 'master':
        sendToMaster({ userData, pullRequest, payload, octokit, context })
        break;
      default:
        return true;
    }
  } catch (err) {
    throw new Error(err)
  }
}