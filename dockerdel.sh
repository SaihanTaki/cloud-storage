docker stop $(docker ps)
docker rm $(docker ps -aq)
docker volume rm $(docker volume ls -q)
# docker image rm $(docker images)


sudo docker stop $(sudo docker ps)
sudo docker rm $(sudo docker ps -aq)
sudo docker volume rm $(sudo docker volume ls -q)
# sudo docker image rm $(sudo docker images)



