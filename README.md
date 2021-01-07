# Github to slack javascript action

This action will send a slack notification with the mentioning reviewer.

## Example usage

.github/workflows/pullrequest-to-slack.yml

You should change user-data to your user data. It's a JSON format.

slack-webhook-url is a secret value from Github. You can add this value from settings of Github repo.

```yml
---
name: "Pull Request to Slack"

on:
  pull_request:
    types: [review_requested, synchronize]
  # pull_request_review:
  #   types: [submitted]
  pull_request_review_comment:
    types: [created, edited]

jobs:
  github_to_slack:
    runs-on: ubuntu-latest
    name: Start
    steps:
      - name: Github to slack
        id: sildeswj
        uses: sildeswj/github-to-slack@latest
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          github-run-id: ${{ github.run_id }}
          user-data: '{ "githubId1": "slackId1", "githubId2": "slackId2", "githubId3": "slackId3", ... }'
```
