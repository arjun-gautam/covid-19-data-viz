# corpolatech
npm run build
git add .
git commit -m 'updating server with new build'
git push origin master
echo "DONE HERE"
#
#
cd
cd .ssh/
ssh -i "corpolatech.pem" ubuntu@ec2-52-14-25-131.us-east-2.compute.amazonaws.com "
cd projects;
cd covid-19-data-viz;
git pull --rebase origin master;
cd ..;
echo 'updated corpolatech';
"
echo "DONE ON THE SERVER SIDE AS WELL"
cd
