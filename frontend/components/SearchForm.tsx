import React from 'react';

type SearchFormProps = {
  url: string;
  query: string;
  loading: boolean;
  onUrlChange: (val: string) => void;
  onQueryChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
};

export default function SearchForm({
  url,
  query,
  loading,
  onUrlChange,
  onQueryChange,
  onSubmit,
  onClear
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex flex-col gap-4">
        <input
          type="url"
          value={url}
          onChange={e => onUrlChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
          placeholder="Enter website URL"
          required
        />
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
          placeholder="Enter search query"
          required
        />
        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded transition active:scale-95"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="bg-gray-100 border border-gray-300 text-gray-800 font-semibold py-2 px-5 rounded hover:bg-gray-200 transition active:scale-95"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
