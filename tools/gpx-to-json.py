import gpxpy
import gpxpy.gpx
from math import radians, cos, sin, asin, sqrt
import json
import math

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371000 # Radius of earth in meters
    return c * r

def process_gpx(file_path):
    try:
        with open(file_path, 'r') as gpx_file:
            gpx = gpxpy.parse(gpx_file)

        print('[')
        for track in gpx.tracks:
            for segment in track.segments:
                prev_point = None
                
                for point in segment.points:
                    speed_mps = 0.0
                    
                    if prev_point and point.time and prev_point.time:
                        # Calculate distance in meters
                        dist = haversine(prev_point.longitude, prev_point.latitude, 
                                         point.longitude, point.latitude)
                        
                        # Calculate time difference in seconds
                        time_diff = (point.time - prev_point.time).total_seconds()
                        
                        if time_diff > 0:
                            speed_mps = dist / time_diff
                    
                    heading = 0.0
                    if prev_point:
                        lat1 = math.radians(prev_point.latitude)
                        lat2 = math.radians(point.latitude)
                        d_lon = math.radians(point.longitude - prev_point.longitude)
                        
                        y = math.sin(d_lon) * math.cos(lat2)
                        x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(d_lon)
                        
                        bearing = math.atan2(y, x)
                        heading = (math.degrees(bearing) + 360) % 360

                    if prev_point:
                        print(',')  # Print comma before each entry except the first
                    print('  '+ json.dumps({
                        "latitude": point.latitude,
                        "longitude": point.longitude,
                        "altitude": point.elevation,
                        "heading": heading,
                        "speed": speed_mps
                    }), end="")
                    
                    prev_point = point

        print('\n]')

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Replace with your actual GPX file path
    GPX_FILE_PATH = "/home/vjoba/Downloads/a.gpx"
    
    # You may need to install gpxpy: pip install gpxpy
    process_gpx(GPX_FILE_PATH)