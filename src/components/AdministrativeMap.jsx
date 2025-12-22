// src/components/AdministrativeMap.jsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

const boundaryStyle = {
  color: "#d32f2f",
  weight: 2,
  fillOpacity: 0.05,
};

export default function AdministrativeMap({
  division,
  district,
  upazila,
  union,
}) {
  const mapRef = useRef(null);
  const [data, setData] = useState({});

  useEffect(() => {
    Promise.all([
      fetch("/geo/divisions.json").then(r => r.json()),
      fetch("/geo/districts.json").then(r => r.json()),
      fetch("/geo/upazilas.json").then(r => r.json()),
      fetch("/geo/unions.json").then(r => r.json()),
    ]).then(([div, dist, upa, uni]) => {
      setData({
        division: div,
        district: dist,
        upazila: upa,
        union: uni,
      });
    });
  }, []);

  const filterFeature = (feature, level) => {
    if (level === "division") return feature.properties.NAME_1 === division;
    if (level === "district") return feature.properties.NAME_2 === district;
    if (level === "upazila") return feature.properties.NAME_3 === upazila;
    if (level === "union") return feature.properties.NAME_4 === union;
    return false;
  };

  const zoomToFeature = feature => {
    const bounds = L.geoJSON(feature).getBounds();
    mapRef.current.fitBounds(bounds, { padding: [40, 40] });
  };

  const renderLayer = level => {
    if (!data[level]) return null;
    const value = { division, district, upazila, union }[level];
    if (!value) return null;

    return (
      <GeoJSON
        data={data[level]}
        style={boundaryStyle}
        filter={f => filterFeature(f, level)}
        onEachFeature={f => zoomToFeature(f)}
      />
    );
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        style={{ height: "400px", width: "100%" }}
        whenCreated={map => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {renderLayer("division")}
        {renderLayer("district")}
        {renderLayer("upazila")}
        {renderLayer("union")}
      </MapContainer>

      {(division || district || upazila || union) && (
        <div className="map-overlay">
          {union || upazila || district || division}
          <br />
          <small>Administrative boundary</small>
        </div>
      )}
    </div>
  );
}
