/* eslint-disable no-throw-literal */
const core = require('@actions/core');
// const github = require('@actions/github');
const { execSync } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const main = async () => {
	try {
		// const token = core.getInput('token', { required: true });   //to be used when introducing GH Action YAML
		// eslint-disable-next-line no-undef
		const {GH_TOKEN} = process.env;
		const token = GH_TOKEN;
        
		const getRepos = execSync(`npx repo-report ls --token ${token}`, {encoding: 'utf-8'});
		const repositories = getRepos.substring(0,getRepos.length-1).split('\n');
		console.log(repositories, getRepos);
		const repoOSSF = {};
		repositories.forEach((repository) => {
			console.log(repository);
			const cmd = `export GITHUB_AUTH_TOKEN=${token} && scorecard --repo=github.com/${repository}| grep Aggregate`;
			const output = execSync(cmd, { encoding: 'utf-8' });
			repoOSSF[repository] = output.substring(17).replace('\n', '');
			console.log('Aggregate score for', repository, ': ', output.substring(17));
		});

		const json = JSON.stringify(repoOSSF, null, 4);
		fs.writeFile('repo-report-ossf-score.json', json, 'utf8', (err) => {
			if (err) {
				return console.error(err);
			}
			return console.log(err);
		});

	}catch(error){
		core.setFailed(
			error.message
		);
	}
};

main();