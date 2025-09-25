import socket
import os
import time
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

while True:
    os.chdir('/etc/ssl/private/')
    filename = "omh737.ext"
    myIp = None
    is_cert_for_ip_working = False

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
            is_cert_for_ip_working = check_https_working(myIp)
            break
        line = f.readline()

    f.close()
    if is_cert_for_ip_working:
        print(myIp, 'found, no changes')
    else:
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

        os.system('openssl x509 -req -in omh737.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial -out omh737.crt -days 3650 -sha256 -extfile omh737.ext -passin env:MYCAPASS')
        os.system('systemctl restart nginx')
    time.sleep(60)
