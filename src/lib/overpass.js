export async function getChargingStations(lat, lon) {
  let query = `
    [out:json];
    node["amenity"="charging_station"](around:500, ${lat}, ${lon});
    out;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  const data = await res.json();

  return data.elements.map((el) => ({
    lat: el.lat,
    lon: el.lon,
  }));
}