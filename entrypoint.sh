#!/bin/sh


# Apply hotfix for 'fatal: unsafe repository' 
git config --global --add safe.directory "${GITHUB_WORKSPACE}"
cd "${GITHUB_WORKSPACE}" || exit

#Set variables
VERSION_FILE="${FILE}:-package.json"
EXISTING_VERSIONS=`git tag`
NEW_VERSION=`grep version $VERSION_FILE | sed 's/.*"version": "\(.*\)".*/\1/'`
VERSION="v${NEW_VERSION}"
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
ls 
echo "looking for version"
echo $VERSION 
if [[ $EXISTING_VERSIONS == *$VERSION* ]]; then
  echo "tag already exists"
  exit 1 
fi
echo "Creating tag"
git tag -a "${VERSION}" -m "realese ${VERSION}"
echo "pusing tag to repository"
git push origin --tags
echo "tag created"