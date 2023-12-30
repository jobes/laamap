### Aviation map for Slovakia

[Live App](https://map.stork-nav.app/)

[![CI](https://github.com/jobes/laamap/actions/workflows/ci.yml/badge.svg)](https://github.com/jobes/laamap/actions/workflows/ci.yml)
[![deploy mapview](https://github.com/jobes/laamap/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/jobes/laamap/actions/workflows/gh-pages.yml)

- weather radar for storms (using [rainviewer](https://www.rainviewer.com/))
- airspaces for Slovakia (using [openaip.net](https://www.openaip.net/))
- airports for Slovakia (using [openaip.net](https://www.openaip.net/))
- image gallery (used for some airports) powered by [lightgallery](https://www.lightgalleryjs.com/)
- notams (using [notams.aim.faa.gov](https://notams.aim.faa.gov))
- compass and position visualization
- direction line for showing fly direction and approximate distance for given time. This line is shown after minimum speed is exceed
- widgets for GPS powered instuments - speed meter, altitude meter and vario meter
- widget for current flight duration and on clicking on this widget flight history is displayed
- navigation to multiple points on map, widget with current navigation statistics
- map control using gamepad with basic dialog control support
- save own point to map that can be used for the navigation
- global search on left top with search icon, there can se searched for route, airport, interest point and address
- map can be installed as PWA
- support for terrain, it is visible on map and altitude above ground is calculated using MSL altitude (from GPS) and terrain elevation

### Secrets and keys

Keys are required for some functionalities, for example for [maptiler](https://www.maptiler.com/). Keys and passwords should be saved in `.env` file

```
NX_MAP_TILES_KEY=yourKey
NX_LIGHT_GALLERY_KEY=yourKey
```

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

### Map icon

flaticon.com [aviation icons](https://www.flaticon.com/free-icon/airport_3295244)

### POI icons

https://www.pngwing.com/en/free-png-izway/download?width=24

https://www.pngwing.com/en/free-png-bhypm/download?width=24

https://www.pngwing.com/en/free-png-tmyal/download?width=24

https://www.pngwing.com/en/free-png-tfyct/download?width=24

https://www.pngwing.com/en/free-png-sactd/download?width=24

https://www.pngwing.com/en/free-png-nvgek/download?width=24

https://www.pngwing.com/en/free-png-snkwy/download?width=24

https://www.pngwing.com/en/free-png-ptmbg/download?width=24

https://www.pngwing.com/en/free-png-sjmfo/download?width=24

https://www.pngwing.com/en/free-png-tnjav/download?width=24

https://www.pngwing.com/en/free-png-tnvzw/download?width=24

https://www.pngwing.com/en/free-png-hcwtd/download?width=24

https://www.pngwing.com/en/free-png-vuicb/download?width=24

https://www.freepik.com/icon/point-interest_7616080

https://www.freepik.com/icon/correct_7616102

https://www.freepik.com/icon/travel-guide_7616101

https://www.freepik.com/icon/setting_7616100

https://www.freepik.com/icon/map-book_7616099

https://www.freepik.com/icon/search_7616098

https://www.freepik.com/icon/school_7616094

https://www.freepik.com/icon/flag_7616092

https://www.freepik.com/icon/meeting-place_7616091

https://www.freepik.com/icon/time_7616089

https://www.freepik.com/icon/restaurant_7616087

https://www.freepik.com/icon/favourite_7616072

https://www.freepik.com/icon/home-address_7616069
