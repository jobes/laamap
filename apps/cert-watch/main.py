import socket
import os
import ssl
import urllib.request
import urllib.error

def check_https_working(ip_address, port=443, timeout=5):
    """
    Check if HTTPS server is working on the given IP address.
    Returns True if HTTPS is working, False otherwise.
    """
    try:
        # Create SSL context that doesn't verify certificates (since we're testing our own)
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        # Try to establish an HTTPS connection
        url = f"https://{ip_address}:{port}/"
        request = urllib.request.Request(url)
        
        # Set a timeout to avoid hanging indefinitely
        with urllib.request.urlopen(request, timeout=timeout, context=ssl_context) as response:
            # If we get here, HTTPS is working (any response code is fine)
            return True
            
    except (urllib.error.URLError, urllib.error.HTTPError, socket.timeout, ssl.SSLError, OSError):
        # Any error means HTTPS is not working properly
        return False

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

needsCertificateGeneration = False

if ipAlreadyChecked:
    print(myIp, 'found in file, checking HTTPS connectivity...')
    
    # Check if HTTPS is working on this IP
    if check_https_working(myIp):
        print('HTTPS is working, end')
        exit(0)
    else:
        print('HTTPS not working, regenerating certificate')
        needsCertificateGeneration = True
else:
    print('IP not found, adding to list')
    needsCertificateGeneration = True

if needsCertificateGeneration:
    # Only add IP to file if it wasn't already there
    if not ipAlreadyChecked:
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

    # Generate certificate (this happens whether IP was added or just needs regeneration)
    os.system('openssl x509 -req -in omh737.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial -out omh737.crt -days 3650 -sha256 -extfile omh737.ext')
    os.system('systemctl restart nginx')
