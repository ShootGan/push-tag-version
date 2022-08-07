#!/bin/sh


# Apply hotfix for 'fatal: unsafe repository' 
git config --global --add safe.directory "${GITHUB_WORKSPACE}"
cd "${GITHUB_WORKSPACE}" || exit

#Set variables
VERSION_FILE="${FILE}:-package.json"
EXISTING_VERSIONS=`git tag`
NEW_VERSION="v`grep version $VERSION_FILE | sed 's/.*"version": "\(.*\)".*/\1/'`"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
echo ls 
echo "looking for version"
echo $NEW_VERSION 
if [[ $EXISTING_VERSIONS == *$NEW_VERSION* ]]; then
  echo "tag already exists"
  exit 1 
fi
echo "Creating tag"
git tag -a "${NEW_VERSION}" -m "realese ${NEW_VERSION}"
echo "pusing tag to repository"
git push origin --tags
echo "tag created"