import socket
import os

os.chdir('/etc/ssl/private/')

filename = "omh737.ext"
myIp = None
ipAlreadyChecked = False

while myIp is None:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('10.0.0.0', 0))  
        myIp = s.getsockname()[0]
        s.close()
    except:
        pass

f = open(filename)

line = f.readline()
while(not line.startswith("[alt_names]")):
    line = f.readline()

line = f.readline()
while line:
    if myIp in line:
        ipAlreadyChecked = True
        break
    line = f.readline()

f.close()
if ipAlreadyChecked:
    print(myIp, 'found, end')
    exit(0)

print('IP not found, adding to list')

f = open(filename)
fileCopy = f.read()
f.close()

lines = fileCopy.splitlines()
lines[-1] = lines[-1][:7] + myIp
newContent = '\n'.join(lines)

f = open(filename, 'w')
f.write(newContent)
f.close()
print('IP added to list')

os.system('openssl x509 -req -in omh737.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial -out omh737.crt -days 3650 -sha256 -extfile omh737.ext')
os.system('systemctl restart nginx')
