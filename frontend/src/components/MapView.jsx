import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ complaints }) => {
    const center = [13.0827, 80.2707]; // Default Center (e.g. Chennai)

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', marginTop: '1rem' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MarkerClusterGroup>
                    {complaints.map(c => {
                        // SIMULATION: If no real lat/lng, generate one around the center for demo
                        let lat = c.latitude;
                        let lng = c.longitude;

                        if (!lat || !lng) {
                            // Deterministic random based on ID to keep pins stable
                            const offsetLat = ((c.id * 123) % 100) / 1000 - 0.05;
                            const offsetLng = ((c.id * 321) % 100) / 1000 - 0.05;
                            lat = center[0] + offsetLat;
                            lng = center[1] + offsetLng;
                        }

                        // Adjust pin colors intuitively
                        const customIcon = new L.Icon({
                            iconUrl: c.status === 'RESOLVED' 
                                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
                                : c.status === 'PENDING'
                                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                                : icon,
                            shadowUrl: iconShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });

                        return (
                            <Marker key={c.id} position={[lat, lng]} icon={customIcon}>
                                <Popup>
                                    <div style={{ textAlign: 'center' }}>
                                        <strong>{c.title}</strong><br />
                                        <span style={{
                                            color: c.status === 'RESOLVED' ? 'green' : c.status === 'PENDING' ? 'red' : 'blue',
                                            fontWeight: 'bold'
                                        }}>
                                            {c.status}
                                        </span>
                                        <br />
                                        👍 {c.upvotes}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default MapView;
