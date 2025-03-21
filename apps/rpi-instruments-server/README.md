# RPI aircraft HTTP server

A small RPi server that serves engine and pressure data. This is an example implementation for Rotax 912UL and MGL RDAC VD. Its purpose is to send all data to stork navigation to replace AFIS.

BAR widgets available for:

- rpm
- cht1Temp
- cht2Temp
- oilTemp
- oilPressure
- fuelLevel

For stork nav system-wide use:

- airPressure
- ias (indicated airspeed)

For show and control:

- RPi cpuUsage
- Rpi ramUsage
- Rpi cpuTemp

Data not logged in RPi. You can connect to this server just by going to its IP, or from stork in settings-> instruments-> and setting the URL for this server.

# Installation

On RPi install `Sudo apt-get install python3-tornado python3-systemd nginx`

## HTTPS

### Create certification authority

save the configuration file:

```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
IP.1 = 192.168.203.224
IP.2 = 192.168.0.158
```

Create self signed certificate and certification authority, `omh737` replace with your aircraft name

```
openssl genrsa -des3 -out myCA.key 2048
openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem
openssl genrsa -out omh737.key 2048
openssl req -new -key omh737.key -out omh737.csr
openssl x509 -req -in omh737.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial -out omh737.crt -days 3650 -sha256 -extfile omh737.ext

sudo mv omh737.crt /etc/ssl/private/
sudo mv omh737.key /etc/ssl/private/
```

Install myCA.pem to Android/chromium

### Configure NGINX

Set file `/etc/nginx/sites-available/default`

```
server {
	listen 443 ssl;
	ssl_certificate /etc/ssl/private/omh737.crt;
	ssl_certificate_key /etc/ssl/private/omh737.key;
	location / {
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_http_version 1.1;
		proxy_pass [http://127.0.0.1:8888](http://127.0.0.1:8888/);
	}
}
server {
	listen 80 default_server;
	listen [::]:80 default_server;
	location / {
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_http_version 1.1;
		proxy_pass http://127.0.0.1:8888;
	}
}
```

Copy server files to except `aircraft_instruments.service` to `/usr/local/bin/instruments-server`.

Start the server

```
sudo cp aircraft_instruments.service /etc/systemd/system
sudo chown root:root /etc/systemd/system/aircraft_instruments.sudo
sudo chmod 644 /etc/systemd/system/aircraft_instruments.service
sudo systemctl start aircraft_instruments.service
sudo systemctl enable aircraft_instruments_service
```

Your aircraft instrument server should be accessible from your local network where your Raspberry Pi is connected. You can connect to the IP of your raspberry Pi, https on port 443 and http on ports 80 and 888 should be working now.
