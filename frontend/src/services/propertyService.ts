// Récupère toutes les propriétés, pas seulement celles d'un owner
export async function getAllProperties() {
  const response = await fetch("http://localhost:3000/api/properties");
  if (!response.ok) throw new Error("Failed to fetch properties");
  return response.json();
}
