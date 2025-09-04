

import { createContext, useContext, useState } from 'react';
import { searchBooks } from './api';
import './App.css';

const BookFinderContext = createContext();

export function useBookFinder() {
  return useContext(BookFinderContext);
}

function BookFinderProvider({ children }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const docs = await searchBooks(query);
      if (!docs.length) {
        setError("No results found.");
        setResults([]);
      } else {
        setResults(docs.slice(0, 20));
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookFinderContext.Provider value={{ query, setQuery, results, loading, error, handleSearch }}>
      {children}
    </BookFinderContext.Provider>
  );
}

function BookFinderHeader() {
  const { query, setQuery, loading, error, handleSearch } = useBookFinder();
  return (
    <header className="header-bar">
      <div className="header-content">
        <h1>Book Finder</h1>
        <p>Search for books by title, author, or keyword</p>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>Search</button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p style={{color: 'crimson'}}>{error}</p>}
      </div>
    </header>
  );
}

function BookResults() {
  const { results, loading, error } = useBookFinder();
  if (loading || error || results.length === 0) return null;
  return (
    <div className="results">
      <div className="results-grid">
        {results.map(book => (
          <div className="book-card" key={book.key}>
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
              />
            ) : (
              <div className="no-cover">No Cover</div>
            )}
            <div className="book-card-title">{book.title}</div>
            <div className="book-card-author">{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</div>
            <div className="book-card-year">{book.first_publish_year ? `First published: ${book.first_publish_year}` : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BookFinderProvider>
      <div className="book-finder-container column-layout">
        <BookFinderHeader />
        <main className="main-content">
          <BookResults />
        </main>
      </div>
    </BookFinderProvider>
  );
}

export default App
