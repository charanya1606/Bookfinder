import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchBooks } from './api';

// Helper to mock fetch
function mockFetch(response, ok = true) {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
    })
  );
}

describe('searchBooks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns docs array from API response', async () => {
    const mockDocs = [{ title: 'Book 1' }, { title: 'Book 2' }];
    mockFetch({ docs: mockDocs });
    const result = await searchBooks('test');
    expect(result).toEqual(mockDocs);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://openlibrary.org/search.json?q=test')
    );
  });

  it('throws error on network error', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    await expect(searchBooks('fail')).rejects.toThrow('Network error');
  });

  it('returns empty array if docs is missing', async () => {
    mockFetch({});
    const result = await searchBooks('nodocs');
    expect(result).toEqual([]);
  });
});
