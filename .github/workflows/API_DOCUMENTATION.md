# 📡 SIH Groundwater API Documentation

### Base URL: `http://localhost:5000/api`

---

## 1. GIS MapLibre Features (GeoJSON)

- **Endpoint:** `GET /groundwater/gis/stations`
- **Query Params:** `district` (Optional, e.g., `?district=Cuddalore`)
- **Description:** Returns groundwater stations in GeoJSON format ready for direct MapLibre rendering.
- **Response:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [79.771, 11.748]
      },
      "properties": {
        "id": 1,
        "stationId": "ST_001",
        "stationName": "Cuddalore Central",
        "district": "Cuddalore",
        "block": "Kurinjipadi"
      }
    }
  ]
}