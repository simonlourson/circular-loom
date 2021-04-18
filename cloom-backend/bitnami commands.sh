sudo git clone https://github.com/simonlourson/circular-loom.git
sudo chown -R bitnami circular-loom
sudo cp /opt/bitnami/apache/conf/vhosts/sample-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-vhost.conf
sudo cp /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf
sudo /opt/bitnami/ctlscript.sh restart apache

sudo cp /opt/bitnami/apache/conf/vhosts/sample-vhost.conf /opt/bitnami/apache/conf/vhosts/sample-vhost.conf.disabled 

cd /home/bitnami/circular-loom/cloom-backend
sudo forever start -e ../logs/err.20210205.log -o ../logs/out.20210205.log build/server.js
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


ALTER USER postgres PASSWORD 'zCTJQjkPa12eH3bE';

sudo nano /etc/postgresql/11/main/pg_hba.conf

sudo /opt/bitnami/letsencrypt/lego --path /opt/bitnami/letsencrypt --email="mazetlouis@gmail.com" --http --http-timeout 30 --http.webroot /opt/bitnami/apps/letsencrypt --domains=filunique.com renew && sudo /opt/bitnami/apache/bin/httpd -f /opt/bitnami/apache/conf/httpd.conf -k graceful # bncert-autorenew