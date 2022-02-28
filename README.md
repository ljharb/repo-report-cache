# repo-report-cache

To test locally,

* `git checkout main`

* Run `node index.js`

* Aggregate OpenSSF score gets cached in `repo-report-ossf-score.json`

To test the action,

* `git checkout -b actions`

* `git pull origin actions`
* Make some minor change in the code and push the changes to `actions` branch.
* Observe the resulting triggered workflow. The aggregate OpenSSF score gets logged.
