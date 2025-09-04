// src/api.js
export async function searchBooks(query) {
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  return data.docs || [];
}
