import { SearchResult } from '../pages/index';

interface ResultsListProps {
  results: SearchResult[];
}

export default function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div
          key={index}
          className="group bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Header with rank and score */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-md">
                #{index + 1}
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Relevance Score</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${Math.min(result.score * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Position indicator */}
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Position</div>
              <div className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                {result.chunk.start} - {result.chunk.end}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-gray-800 leading-relaxed text-base pl-3">
              {result.chunk.text}
            </p>
          </div>

          {/* Footer with metadata */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span>{result.chunk.text.split(/\s+/).length} words</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{result.chunk.text.length} characters</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
