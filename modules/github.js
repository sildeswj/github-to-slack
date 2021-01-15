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

export const sendToMaster = async ({ userData, context, octokit }) => {
  const { payload } = context;

  let commits = payload.commits
  commits = commits.filter(commit => commit.committer.username === 'web-flow')

  const responseAll = commits.map(async commit => {
    return octokit.repos.listPullRequestsAssociatedWithCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_sha: commit.id,
    });
  })
  let pullRequests = await Promise.all(responseAll)
  const messages = pullRequests.map(pullRequest => {
    let data = pullRequest.data
    data = data[0]

    const owner = userData[data.user.login]
    const returnValue = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `주인장: <@${owner}>\n ${data.body}`
      }
    }

    return returnValue
  })

  console.log('messages: ', messages);


  const params = {
    text: "",
    blocks: [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "새로운 기능이 배포됐어요 🥳",
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
        ...messages
      },
      // {
      //   type: "section",
      //   text: {
      //     type: "mrkdwn",
      //     text: `주인장: <@${requestedBy}>`
      //   }
      // },
      // {
      //   type: "section",
      //   text: {
      //     type: "mrkdwn",
      //     text: pullRequest.body
      //   }
      // },
      {
        "type": "divider"
      }
    ]
  }
  const toWhere = 'normal'
  const result = await sendNotification({ params, toWhere })
  return result
}

export const sendClosed = async ({ userData, payload, octokit, context }) => {
  try {
    const pullRequest = payload.pull_request;

    switch (pullRequest.base.ref) {
      // pull request closed (develop)
      case 'develop':
        sendToStaging({ userData, pullRequest })
        break;
      // pull request closed (master)
      // case 'master':
      //   sendToMaster({ userData, pullRequest, payload, octokit, context })
      // break;
      default:
        return true;
    }
  } catch (err) {
    throw new Error(err)
  }
}