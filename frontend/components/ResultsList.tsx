import React from 'react';
import { SearchResult } from '../pages/index';

type ResultsListProps = {
  results: SearchResult[];
};

export default function ResultsList({ results }: ResultsListProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p className="text-xl">No results found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 mt-4">
      {results.map((result, idx) => (
        <div key={idx} className="border rounded-lg shadow-sm p-5 bg-white">
          <div className="flex items-center mb-2 space-x-3">
            <span className="text-gray-500 text-sm">Chunk <b>#{idx + 1}</b></span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Score: {result.score.toFixed(3)}</span>
          </div>
          <pre className="break-words text-gray-800 whitespace-pre-wrap text-base mb-1" style={{maxHeight: 320, overflow: 'auto'}}>
            {result.chunk.text}
          </pre>
        </div>
      ))}
    </div>
  );
}
