import { useEffect, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { RouteStop } from '../../types'
import { mockCoordinates as MOCK_COORDINATES } from '@/mocks/data'

// Fix for default marker icons in webpack/vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom markers for pickup (green) and delivery (red)
const pickupIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const deliveryIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type RouteMapProps = {
  stops: RouteStop[]
  className?: string
}

function MapController({ stops }: { stops: RouteStop[] }) {
  const map = useMap()

  useEffect(() => {
    if (stops.length === 0) {
      map.setView([39.8283, -98.5795], 4) // Center of US
      return
    }

    const coordinates = stops
      .map((s) => MOCK_COORDINATES[s.locationId])
      .filter(Boolean)

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(
        coordinates.map((c) => L.latLng(c[0], c[1]))
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [stops, map])

  return null
}

export function RouteMap({ stops, className }: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  const coordinates = stops
    .map((s) => MOCK_COORDINATES[s.locationId])
    .filter(Boolean)

  return (
    <div
      className={`h-48 overflow-hidden rounded-lg border ${className || ''}`}
    >
      <MapContainer
        ref={mapRef}
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController stops={stops} />

        {stops.map((stop, index) => {
          const coord = MOCK_COORDINATES[stop.locationId]
          if (!coord) return null

          return (
            <Marker
              key={stop.id || index}
              position={coord}
              icon={stop.type === 'pickup' ? pickupIcon : deliveryIcon}
            />
          )
        })}

        {coordinates.length > 1 && (
          <Polyline
            positions={coordinates}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  )
}
