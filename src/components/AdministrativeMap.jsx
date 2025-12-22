import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const boundaryStyle = {
  color: "#d32f2f",
  weight: 2.5,
  fillOpacity: 0.07,
};

export default function AdministrativeMap({
  division,
  district,
  upazila,
  union,
}) {
  const mapRef = useRef(null);
  const [geo, setGeo] = useState({
    divisions: null,
    districts: null,
    upazilas: null,
    unions: null,
  });

  useEffect(() => {
    Promise.all([
      fetch("/geo/divisions.json").then(r => r.json()),
      fetch("/geo/districts.json").then(r => r.json()),
      fetch("/geo/upazilas.json").then(r => r.json()),
      fetch("/geo/unions.json").then(r => r.json()),
    ]).then(([d1, d2, d3, d4]) =>
      setGeo({
        divisions: d1,
        districts: d2,
        upazilas: d3,
        unions: d4,
      })
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const level =
      union ? "union" :
      upazila ? "upazila" :
      district ? "district" :
      division ? "division" :
      null;

    if (!level) return;

    const source =
      level === "division" ? geo.divisions :
      level === "district" ? geo.districts :
      level === "upazila" ? geo.upazilas :
      geo.unions;

    if (!source) return;

    const feature = source.features.find(f => {
      if (level === "division") return f.properties.NAME_1 === division;
      if (level === "district") return f.properties.NAME_2 === district;
      if (level === "upazila") return f.properties.NAME_3 === upazila;
      if (level === "union") return f.properties.NAME_4 === union;
      return false;
    });

    if (feature) {
      const bounds = L.geoJSON(feature).getBounds();
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [division, district, upazila, union, geo]);

  const renderLayer = (data, filterFn) =>
    data && (
      <GeoJSON
        data={data}
        style={boundaryStyle}
        filter={filterFn}
      />
    );

  return (
    <div className="map-container">
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        style={{ height: 420, width: "100%" }}
        whenCreated={map => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {division &&
          renderLayer(geo.divisions, f => f.properties.NAME_1 === division)}

        {district &&
          renderLayer(geo.districts, f => f.properties.NAME_2 === district)}

        {upazila &&
          renderLayer(geo.upazilas, f => f.properties.NAME_3 === upazila)}

        {union &&
          renderLayer(geo.unions, f => f.properties.NAME_4 === union)}
      </MapContainer>

      {(division || district || upazila || union) && (
        <div className="map-overlay">
          {union || upazila || district || division}
          <br />
          <small>Selected Administrative Area</small>
        </div>
      )}
    </div>
  );
}
