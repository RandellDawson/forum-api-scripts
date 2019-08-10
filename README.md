# Summary
This is a collection of scripts used to perform various tasks in the forum.  The original purpose was to update 262 existing forum topic posts which had high view count for the hints/solutions for certain challenges.  Later, other scripts were added to add new topics for the remaining FCC curriculum challenges which needed either stub content or the actual guide article content containing hints/solutions.

All of the scripts create a JSON log file which details the status of the action(s) taken ("success" or "failed") for each topic added/updated.
## Scripts

### Changing visible status (visible or hide) for all the Challenge Guide topics
You can update run the `change-visible-status-of-all-topics.js` script with and argument value of `list` or `unlist` and this status will be updated across all of the Challenge Guide topics. This affects the visible status of the topic during searches.

### Changing closed status (open or close) for all the Challenge Guide topics
You can update run the `change-closed-status-of-all-topics.js` script with and argument value of `open` or `closed` and this status will be updated across all of the Challenge Guide topics.  This affects users (other than admins and moderators) from being able to create or update posts under the topic.

### Validating forum topics have corresponding Challenges and vice versa
You can validate that all the Challenge Guide topics have a corresponding curriculum challenge and all curriculum challenges have a corresponding forumTopicId which matches up to a topic on the forum using the `validate-forum-topics.js`.

### Converting the main header to a link
The script (`update-topic-main-headers-as-links.js`) should only be ran once the current version of the master branch is deployed to production.  It changes the main header the Challenge Guide topic's first post (the wiki) to a link which points back to the curriculum challenge on the production site.


