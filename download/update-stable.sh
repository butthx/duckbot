echo "$ git checkout master"
git checkout master # change the branch from master to master
echo "$ git add ."
git add . # before committing, first add all the files.
echo "$ git commit -m \"stable-update\""
git commit -m "stable-update" # commiting source before pulling 
echo "$ git pull origin master"
git pull origin master # pulling the new update 
echo "$ yarn install"
yarn install # installing new package 
echo "yarn build"
yarn build # building source