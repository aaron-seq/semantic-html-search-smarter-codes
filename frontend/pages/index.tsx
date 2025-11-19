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
        <meta name="description" content="Search HTML content using semantic embeddings with Qdrant vector database" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
              Semantic HTML Search
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover content using AI-powered semantic understanding with{' '}
              <span className="font-semibold text-indigo-600">Qdrant</span> vector database
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm border border-gray-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Qdrant Vector DB
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm border border-gray-200">
                FastAPI Backend
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm border border-gray-200">
                Next.js Frontend
              </span>
            </div>
          </div>

          {/* Search Form */}
          <SearchForm
            url={url}
            query={query}
            loading={loading}
            onUrlChange={setUrl}
            onQueryChange={setQuery}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg animate-shake">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Results Metadata */}
          {searchMeta && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Search Query</p>
                      <p className="font-semibold text-lg">{searchMeta.query}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Total Chunks</p>
                      <p className="font-semibold text-lg">{searchMeta.total_chunks}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Top Results</p>
                      <p className="font-semibold text-lg">{results.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <ResultsList results={results} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && results.length === 0 && !searchMeta && (
            <div className="mt-16 text-center">
              <div className="inline-block p-6 bg-white rounded-3xl shadow-xl mb-6">
                <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Ready to Search</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Enter a website URL and your search query above to discover relevant content using semantic AI
              </p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
