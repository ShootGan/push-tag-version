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

const getVersion = (fileContent, versionRegex, tagPrefix) => {
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

  return tagPrefix + version;
};

const getGitTags = async () => {
  core.info('Getting all tags');
  let gitTags = '';
  let gitError = '';
  const options = {};
  options.listeners = {
    stdout: (data) => {
      gitTags += data.toString();
    },
    stderr: (data) => {
      gitError += data.toString();
    },
  };

  await exec.exec('git', ['fetch', '--prune', '--unshallow', '--tags'], options);
  await exec.exec('git', ['tag'], options);
  core.debug(`Tags: ${gitTags}`);
  return gitTags;
};

const checkTagAlredyExists = (tagToAdd, currentTags) => {
  core.info(`Checking if tag ${tagToAdd} already exists`);
  if (currentTags.includes(tagToAdd)) {
    core.setFailed(`Tag ${tagToAdd} already exists`);
    throw new Error(`Tag already exists`);
  }
  core.info(`Tag ${tagToAdd} does not exist`);
};

const createAndPushTag = async (tagToAdd) => {
  core.info(`Creating and pushing tag ${tagToAdd}`);
  await exec.exec('git', ['tag', '-a', tagToAdd, '-m', `Release ${tagToAdd}`]);
  await exec.exec('git', ['push', 'origin', '--tags']);
};

const run = async () => {
  const githubToken = core.getInput('github_token');
  const versionFile = core.getInput('version_file');
  const versionRegex = core.getInput('version_param_regex');
  const tagPrefix = core.getInput('tag_prefix');

  const fileContent = getFile(versionFile);
  const tagToAdd = getVersion(fileContent, versionRegex, tagPrefix);
  const currentTags = await getGitTags();
  checkTagAlredyExists(tagToAdd, currentTags);
  await createAndPushTag(tagToAdd);
  console.log('DUPA');
};

run();
