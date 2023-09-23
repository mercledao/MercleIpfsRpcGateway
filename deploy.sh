#!/bin/bash

current_branch=$(git branch | grep "*")
if [ "$current_branch" != "* master" ]; then
    echo "Not in master"
    exit 1
fi

echo "In $current_branch"

npm version patch

mv .git* ..
mv node_modules ..
mv .vscode ..
cd ..
tar cvzf MercleIpfsRpcGateway.tar MercleIpfsRpcGateway/
scp -i "~/.ssh/daohook-prod.pem" MercleIpfsRpcGateway.tar ec2-user@ec2-44-202-245-41.compute-1.amazonaws.com:/home/ec2-user/

mv .git* MercleIpfsRpcGateway
mv node_modules MercleIpfsRpcGateway
mv .vscode MercleIpfsRpcGateway

ssh_run_server() {
    echo "ssh -i " $1 $2
ssh -i $1 $2 << EOF
  rm -rf _MercleIpfsRpcGateway
  mv MercleIpfsRpcGateway _MercleIpfsRpcGateway
  tar xvzf MercleIpfsRpcGateway.tar
  cp _MercleIpfsRpcGateway/.env* MercleIpfsRpcGateway/
  rm MercleIpfsRpcGateway.tar
  cd MercleIpfsRpcGateway
  npm i
  cd ..
  cd MercleIpfsRpcGateway
  pm2 reload all
EOF
}

ssh_run_server "~/.ssh/daohook-prod.pem" ec2-user@ec2-44-202-245-41.compute-1.amazonaws.com
