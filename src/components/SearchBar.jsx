import { useState } from "react";
import { searchPlace } from "../lib/nominatim";

export default function SearchBar({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runSearch() {
    setLoading(true);
    try {
      let r = await searchPlace(q);
      setResults(r);
      if (r.length === 1) onSelect(r[0]);
    } catch (e) {
      console.error(e);
      alert("Search failed (check console).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex gap-2 items-center font-display width-max">
        <input
          className="flex-1 px-4 py-2 border rounded outline-none"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a place (e.g., Westlands Nairobi)"
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded font-display width-max"
          onClick={runSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length > 1 && (
        <div className="p-2 border-b">
          <div className="text-xs text-gray-500 mb-2 font-display">
            Pick a result:
          </div>
          {results.map((r, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(r)}
              className="p-2 border rounded mb-2 cursor-pointer font-display"
            >
              {r.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
}