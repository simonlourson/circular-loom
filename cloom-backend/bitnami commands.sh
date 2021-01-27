sudo git clone https://github.com/simonlourson/circular-loom.git
sudo chown -R bitnami circular-loom
sudo cp /opt/bitnami/apache/conf/vhosts/sample-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-vhost.conf
sudo cp /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf
sudo /opt/bitnami/ctlscript.sh restart apache

cd /home/bitnami/circular-loom/cloom-backend
forever start -e ../logs/err_20201219.log -o ../logs/out_20201219.log build/server.js
forever start build/server.js

bitnami@ip-172-26-4-86:/opt/bitnami/letsencrypt/certificates$ ls
filunique.com.crt  filunique.com.issuer.crt  filunique.com.json  filunique.com.key

/opt/bitnami/letsencrypt/certificates/filunique.com.crt
/opt/bitnami/letsencrypt/certificates/filunique.com.key

cd cd /opt/bitnami/apache/conf/vhosts/
vi sample-https-vhost.conf

ps -ef | grep server
kill 14481

sudo export ADDRESS="filunique.com"
ADDRESS

ADDRESS="filunique.com"; export ADDRESS


sudo forever start -e ./logs/err_20210110.log -o ./logs/out_20210110.log dist/index.js