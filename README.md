### Aviation map for Slovakia

[Live App Demo](https://jobes.github.io/laamap/)

- weather radar for storms (using [rainviewer](https://www.rainviewer.com/))
- airspaces for Slovakia (using [openaip.net](https://www.openaip.net/))
- airports for Slovakia (using [openaip.net](https://www.openaip.net/))
- image gallery (used for some airports) powered by [lightgallery](https://www.lightgalleryjs.com/)
- notams (using [notams.aim.faa.gov](https://notams.aim.faa.gov))
- compass and position visualization

Map icon [Plane icons created by Good Ware - Flaticon](https://www.flaticon.com/free-icons/plane).

### Proxy for NOTAM CORS problem

As [notams.aim.faa.gov](https://notams.aim.faa.gov) does not work for browser app because of CORS, a proxy is needed. Config for NGINX:

```
server {
        listen 443      ssl http2;
        listen [::]:443 ssl http2;
        server_name notams.example.com;

        ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

        location / {
                proxy_pass https://notams.aim.faa.gov;
                proxy_set_header Origin https://notams.aim.faa.gov;
                proxy_hide_header Access-Control-Allow-Origin;
                add_header Access-Control-Allow-Origin $http_origin always;
                proxy_ignore_headers "Set-Cookie" "Expires" "Cache-Control";
                proxy_hide_header "Set-Cookie";
                proxy_hide_header "Expires";
                proxy_hide_header "Cache-Control";

                proxy_cache my_cache;
                proxy_cache_valid 200 60m;
                proxy_cache_methods POST;
                proxy_cache_key "$request_uri|$request_body";
                add_header X-Cached $upstream_cache_status;
        }
}
```
