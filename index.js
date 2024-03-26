const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const exec = require('@actions/exec');

const getFile = (versionFile) => {
  try {
    core.info(`Looking for  ${versionFile}`);
    const currentPath = path.resolve(versionFile);
    var content = fs.readFileSync(currentPath).toString();
    return content;
  } catch (error) {
    core.setFailed(`Error reading version file: ${error.message}`);
  }
};

const getVersion = (fileContent, versionRegex) => {
  core.info(`Looking for version`);
  core.debug(`Version regex: ${versionRegex}`);
  core.debug(`File content: ${fileContent}`);
  const regex = new RegExp(versionRegex);
  const version = fileContent.match(regex)[1];
  if (!version) {
    core.debug(`regex: ${regex}, version: ${version}`);
    core.setFailed('Version not found in file');
  }
  core.info(`Found version: ${version}`);
  return version;
};

const getGitTags = async () => {
  core.info('Getting all tags');
  let gitTags = '';
  const options = {};
  options.listeners = {
    stdout: (data) => {
      gitTags += data.toString();
    },
  };
  await exec.exec('git', ['tag']);
  core.debug(`Tags: ${gitTags}`);
  return gitTags;
};

const checkTag = (tagToAdd, currentTags) => {
  core.info(`Checking if tag ${tagToAdd} already exists`);
  if (currentTags.include(tagToAdd)) {
    core.setFailed(`Tag ${tagToAdd} already exists`);
  }
  core.info(`Tag ${tagToAdd} does not exist`);
};

const run = () => {
  const githubToken = core.getInput('github_token');
  const versionFile = core.getInput('version_file');
  const versionRegex = core.getInput('version_param_regex');
  const tagPrefix = core.getInput('tag_prefix');

  const fileContent = getFile(versionFile);
  const tagToAdd = getVersion(fileContent, versionRegex);
  const currentTags = getGitTags();
  checkTag(tagToAdd, currentTags);

  console.log('DUPA');
};

run();
