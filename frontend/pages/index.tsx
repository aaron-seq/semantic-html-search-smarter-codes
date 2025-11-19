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

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header with subtle backdrop */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-3">
                Semantic HTML Search
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powered by AI embeddings and Qdrant vector database for intelligent content discovery
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Search Form with enhanced styling */}
          <div className="mb-8">
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

          {/* Error Message */}
          {error && (
            <div className="animate-fadeIn mb-6">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-red-800">Search Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Results Metadata */}
          {searchMeta && (
            <div className="animate-fadeIn mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">Query</p>
                    <p className="font-semibold text-gray-900 truncate" title={searchMeta.query}>{searchMeta.query}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-2">Total Chunks</p>
                    <p className="font-semibold text-gray-900">{searchMeta.total_chunks}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-2">Top Matches</p>
                    <p className="font-semibold text-gray-900">{results.length} Results</p>
                  </div>
                </div>
              </div>
              
              {/* Results List */}
              <div className="mt-6">
                <ResultsList results={results} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && results.length === 0 && !searchMeta && (
            <div className="mt-16 text-center animate-fadeIn">
              <div className="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mb-6">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Discover</h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  Enter a website URL and search query above to find the most relevant content using advanced semantic AI technology
                </p>
              </div>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200/50">
                  <span className="font-semibold">✓</span> Semantic Search
                </div>
                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200/50">
                  <span className="font-semibold">✓</span> AI-Powered
                </div>
                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200/50">
                  <span className="font-semibold">✓</span> Top 10 Results
                </div>
                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200/50">
                  <span className="font-semibold">✓</span> Vector Database
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
