echo "$ git checkout dev"
git checkout dev # change the branch from master to dev
echo "$ git add ."
git add . # before committing, first add all the files.
echo "$ git commit -m \"beta-update\""
git commit -m "beta-update" # commiting source before pulling 
echo "$ git pull origin dev"
git pull origin dev # pulling the new update 
echo "$ yarn install"
yarn install # installing new package 
echo "yarn build"
yarn build # building source