import { useEffect, useState } from "react";
import { getAllProperties } from "../../services/propertyService";
import { useAuth } from "../../contexts/useAuth";

const tunisianCities = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
];

export default function RenterDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProperties();
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = properties
    .filter((p: any) => p.listingType?.toLowerCase() === "rent")
    .filter((p: any) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchesOwner = ownerFilter ? p.ownerId === ownerFilter : true;
      const matchesType = typeFilter ? p.propertyType?.toLowerCase() === typeFilter.toLowerCase() : true;
      const matchesCity = cityFilter ? p.city === cityFilter : true;

      return matchesSearch && matchesOwner && matchesType && matchesCity;
    });
    console.log('filtered',filtered)

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">Find Your Rental Home in Tunisia</h1>
        <p className="mt-2">Discover all rental properties available</p>
      </div>

      {/* Filters */}
      <div className="max-w-4xl mx-auto py-6 flex flex-col sm:flex-row gap-4">
        <input
          className="flex-1 p-3 border rounded"
          placeholder="Search by title, city, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 border rounded"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
        >
          <option value="">All Owners</option>
          {[...new Set(properties.map(p => p.ownerId))].map((id) => (
            <option key={id} value={id}>
              {id === user?.id ? "You" : id}
            </option>
          ))}
        </select>
        <select
          className="p-3 border rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {[...new Set(properties.map(p => p.propertyType))].map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          className="p-3 border rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {tunisianCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Property List */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-600">Loading properties...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600">0 rental properties found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p: any) => (
              <div key={p.id} className="bg-white shadow p-4 rounded">
                <h2 className="text-xl font-bold">{p.title}</h2>
                <p className="text-gray-500">{p.city}</p>
                <p className="mt-2">{p.price} TND</p>
                <p className="text-sm mt-1">{p.description}</p>
                <p className="text-xs text-gray-400 mt-1">Owner: {p.ownerId}</p>
                <p className="text-xs text-gray-400 mt-1">Type: {p.propertyType}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
