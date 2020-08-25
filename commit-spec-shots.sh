#!/bin/bash
cd test
cd in-angular-material

if [ ! -d spec-shots/actual ]; then
  echo "no spec shots found";
  exit 1
fi

stashResult=`git stash`
if [ "$stashResult" = 'No local changes to save' ]; then
  hasToPop=0
else
  hasToPop=1
fi

currentBranch=`git branch --show-current`
echo "current branch: " $currentBranch
if [[ "$currentBranch" == *-spec-shots ]]; then
  echo "already on spec shot branch"
  exit 1
fi

specShotBranch="$currentBranch-spec-shots"
echo "spec shot branch": $specShotBranch

git branch -C $specShotBranch
git checkout $specShotBranch

rm -rf spec-shots/baseline
mv spec-shots/actual spec-shots/baseline

git add spec-shots/baseline
git commit -m 'updated spec shots'
git push --set-upstream origin $specShotBranch --force

git checkout $currentBranch
if [ $hasToPop -gt 0 ]; then
  echo "has to pop"
  git stash pop
fi
