/* eslint-disable no-magic-numbers */

'use strict';

const core = require('@actions/core');
// const github = require('@actions/github');
const { execSync } = require('child_process');
const fs = require('fs/promises');

const main = async () => {
	try {
		const token = core.getInput('token', { required: true }); // to be used when introducing GH Action YAML
		/*
		 * const {GH_TOKEN} = process.env;
		 * const token = GH_TOKEN;
		 */

		const getRepos = execSync('npx repo-report ls', {
			encoding: 'utf-8', env: {
				...process.env,
				GH_TOKEN: token,
			},
		});
		const repositories = getRepos.slice(0, getRepos.length - 1).split('\n');
		const repoOSSF = {};
		repositories.forEach((repository) => {
			console.log(repository);
			const cmd = `scorecard --repo=github.com/${repository} | grep Aggregate`;
			const output = execSync(cmd, {
				encoding: 'utf-8', env: {
					...process.env,
					GITHUB_AUTH_TOKEN: token,
				},
			});
			repoOSSF[repository] = output.slice(17).replace('\n', '');
			console.log('Aggregate score for', repository, ': ', output.slice(17));
		});

		const json = JSON.stringify(repoOSSF, null, 4);
		const result = await fs.writeFile('repo-report-ossf-score.json', json, 'utf8');
		console.log(result);

	} catch (error) {
		core.setFailed(error.message);
	}
};

main();
