const core = require('@actions/core');
const fs = require('fs');

const getFile = (versionFile) => {
  try {
    core.info(`Looking for  ${versionFile}`);
    var content = fs.readFileSync(versionFile);
    return content;
  } catch (error) {
    core.setFailed(`Error reading version file: ${error.message}`);
  }
};

const getVersion = (fileContent, versionRegex) => {
  core.info(`Looking for version`);
  core.debug(`Version regex: ${versionRegex}`);
  const regex = new RegExp(versionRegex, 'g');
  const version = fileContent.match(regex);
  if (!version) {
    core.debug('regex: ${regex}, version: ${version}');
    core.setFailed('Version not found in file');
  }
  core.info(`Found version: ${version}`);
  return version;
};

const run = async () => {
  const githubToken = core.getInput('github_token');
  const versionFile = core.getInput('version_file');
  const versionRegex = core.getInput('version_param_regex');
  const tagPrefix = core.getInput('tag_prefix');

  const fileContent = getFile(versionFile);
  const tagToAdd = getVersion(fileContent, versionRegex);
  console.log('DUPA');
};

run();
