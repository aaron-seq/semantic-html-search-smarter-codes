import { useState, FormEvent } from 'react';
import Head from 'next/head';
import SearchForm from '../components/SearchForm';
import ResultsList from '../components/ResultsList';

export interface SearchResult {
  chunk: {
    text: string;
    start: number;
    end: number;
  };
  score: number;
}

export interface SearchResponse {
  url: string;
  query: string;
  results: SearchResult[];
  total_chunks: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMeta, setSearchMeta] = useState<{ url: string; query: string; total_chunks: number } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!url || !query) {
      setError('Please provide both URL and search query');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSearchMeta(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, query, top_k: 10 })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Search request failed' }));
        throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data: SearchResponse = await res.json();
      setResults(data.results);
      setSearchMeta({
        url: data.url,
        query: data.query,
        total_chunks: data.total_chunks
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setQuery('');
    setResults([]);
    setError('');
    setSearchMeta(null);
  };

  return (
    <>
      <Head>
        <title>Semantic HTML Search - Smarter.codes Assignment</title>
        <meta name="description" content="Search HTML content using semantic embeddings with Qdrant vector database" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Semantic HTML Search
            </h1>
            <p className="text-lg text-gray-600">
              Search HTML content using semantic embeddings with Qdrant vector database
            </p>
          </div>

          <SearchForm
            url={url}
            query={query}
            loading={loading}
            onUrlChange={setUrl}
            onQueryChange={setQuery}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {searchMeta && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Search Query</p>
                    <p className="font-semibold text-gray-900">{searchMeta.query}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Chunks</p>
                    <p className="font-semibold text-gray-900">{searchMeta.total_chunks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Top Results</p>
                    <p className="font-semibold text-gray-900">{results.length}</p>
                  </div>
                </div>
              </div>

              <ResultsList results={results} />
            </div>
          )}

          {!loading && !error && results.length === 0 && !searchMeta && (
            <div className="mt-12 text-center">
              <div className="inline-block p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Search</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Enter a website URL and your search query above to discover relevant content using semantic AI
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
