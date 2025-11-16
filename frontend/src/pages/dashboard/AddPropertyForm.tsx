import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const tunisianCities = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
];

const AddPropertyForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const listingType = query.get('type') || 'sale';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('villa');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      title,
      description,
      price: parseFloat(price),
      size: parseInt(size),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      address,
      city,
      propertyType,
      listingType,
      ownerId: user?.id,
      offerType: ""
    };

    try {
      const res = await fetch('http://localhost:3000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (!res.ok) throw new Error('Failed to add property');
      alert('Property added successfully!');
      navigate('/dashboard/homeowner');
    } catch (error) {
      console.error(error);
      alert('Error adding property');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl space-y-4">
        <h2 className="text-2xl font-bold mb-4">{listingType === 'sale' ? 'Sell' : 'Rent'} a Property</h2>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price (TND)"
          type="number"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          value={size}
          onChange={e => setSize(e.target.value)}
          placeholder="Size (m²)"
          type="number"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          value={bedrooms}
          onChange={e => setBedrooms(e.target.value)}
          placeholder="Bedrooms"
          type="number"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          value={bathrooms}
          onChange={e => setBathrooms(e.target.value)}
          placeholder="Bathrooms"
          type="number"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Address"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* City select */}
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select City</option>
          {tunisianCities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Property Type select */}
        <select
          value={propertyType}
          onChange={e => setPropertyType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="villa">Villa</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;
