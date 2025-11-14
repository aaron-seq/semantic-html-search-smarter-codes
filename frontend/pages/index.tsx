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
        <title>Semantic HTML Search | AI-Powered Content Discovery</title>
        <meta name="description" content="Search HTML content using advanced semantic embeddings and AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 shadow-lg">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
                🔍 Semantic HTML Search
              </h1>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                Discover content intelligently using AI-powered semantic understanding
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-10 max-w-6xl">
          {/* Search Form */}
          <div className="mb-8 transform transition-all duration-300 hover:scale-[1.01]">
            <SearchForm
              url={url}
              query={query}
              loading={loading}
              onUrlChange={setUrl}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-5 shadow-md animate-slide-in">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-red-800 font-semibold text-lg mb-1">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded"></div>
                    <div className="h-3 bg-gray-100 rounded"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Metadata */}
          {searchMeta && !loading && (
            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md p-6 border border-indigo-100 animate-slide-in">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <span className="font-bold text-indigo-900 mr-2">Query:</span>
                  <span className="text-gray-700 bg-white px-3 py-1 rounded-full">{searchMeta.query}</span>
                </div>
                <div className="w-px h-8 bg-indigo-200"></div>
                <div className="flex items-center">
                  <span className="font-bold text-indigo-900 mr-2">Total Chunks:</span>
                  <span className="text-gray-700 bg-white px-3 py-1 rounded-full">{searchMeta.total_chunks}</span>
                </div>
                <div className="w-px h-8 bg-indigo-200"></div>
                <div className="flex items-center">
                  <span className="font-bold text-indigo-900 mr-2">Top Results:</span>
                  <span className="text-gray-700 bg-white px-3 py-1 rounded-full">{results.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && !loading && (
            <ResultsList results={results} />
          )}

          {/* Empty State */}
          {!loading && !error && results.length === 0 && !searchMeta && (
            <div className="mt-20 text-center animate-fade-in">
              <div className="inline-block p-8 bg-white rounded-full shadow-lg mb-6">
                <svg className="h-20 w-20 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to Search</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Enter a website URL and your search query above to discover relevant content using AI-powered semantic search
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20 py-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p className="text-sm">
              Built using FastAPI, Next.js, and Sentence Transformers |
              <a href="https://github.com/aaron-seq/semantic-html-search-smarter-codes" className="text-indigo-600 hover:text-indigo-800 ml-2 font-medium">
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
