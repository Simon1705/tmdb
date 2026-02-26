'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RefreshCw, Clock, CheckCircle2, X, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { format } from 'date-fns/format';

interface SyncButtonProps {
  onSyncComplete?: () => void;
}

export default function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [shouldRenderModal, setShouldRenderModal] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pagesPerCategory, setPagesPerCategory] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const [isSettingsAnimating, setIsSettingsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchLastSync();
  }, []);

  // Cleanup: re-enable scrolling when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchLastSync = async () => {
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      setLastSync(data.lastSync);
    } catch (error) {
      console.error('Error fetching last sync:', error);
    }
  };

  const closeSuccessModal = () => {
    setIsModalAnimating(false);
    // Re-enable scrolling
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      setShowSuccessModal(false);
      setShouldRenderModal(false);
    }, 300);
  };

  const openSuccessModal = (data: any) => {
    setSyncResult(data);
    setShowSuccessModal(true);
    setShouldRenderModal(true);
    // Disable scrolling when modal opens
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      setIsModalAnimating(true);
    }, 10);
    
    // Refresh data in background without page reload
    if (onSyncComplete) {
      setTimeout(() => {
        onSyncComplete();
      }, 500);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    handleCloseSettings(); // Close settings when syncing
    try {
      const response = await fetch('/api/sync', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: pagesPerCategory })
      });
      const data = await response.json();
      
      if (data.success) {
        openSuccessModal(data);
        setShowDetails(true);
        setTimeout(() => setShowDetails(false), 5000);
        await fetchLastSync();
      } else {
        alert('❌ Sync failed. Please try again.');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('❌ Sync failed. Please check your connection.');
    } finally {
      setSyncing(false);
    }
  };

  const fetched = syncResult?.recordsFetched ?? 0;
  const created = syncResult?.recordsCreated ?? 0;
  const updated = syncResult?.recordsUpdated ?? 0;
  const estimatedMovies = pagesPerCategory * 80; // 4 categories × pages × 20 movies

  const handleOpenSettings = () => {
    setShowSettings(true);
    setTimeout(() => setIsSettingsAnimating(true), 10);
  };

  const handleCloseSettings = () => {
    setIsSettingsAnimating(false);
    setTimeout(() => setShowSettings(false), 200);
  };

  const handleToggleSettings = () => {
    if (showSettings) {
      handleCloseSettings();
    } else {
      handleOpenSettings();
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold hover:-translate-y-0.5 cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={handleToggleSettings}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                showSettings
                  ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 border-white/15 text-indigo-200 hover:bg-white/10 hover:border-white/25'
              }`}
              title="Sync settings"
            >
              <Settings className={`w-5 h-5 transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
            </button>
            
            {showSettings && (
              <>
                {/* Dropdown */}
                <div className={`absolute right-0 top-full mt-3 w-80 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-200 origin-top-right ${
                  isSettingsAnimating 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 -translate-y-2'
                }`}>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/10 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Sync Settings
                      </h3>
                      <button
                        onClick={handleCloseSettings}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-white/70 hover:text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    {/* Pages Input */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Pages per Category
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={pagesPerCategory}
                            onChange={(e) => setPagesPerCategory(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                            className="w-full px-4 py-3 bg-slate-950/50 border-2 border-white/20 rounded-xl text-white text-center text-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <span className="text-xs text-white/40 font-medium">pages</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => setPagesPerCategory(Math.min(10, pagesPerCategory + 1))}
                            className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg border border-indigo-500/30 hover:border-indigo-500/50 transition-all group"
                          >
                            <svg className="w-4 h-4 text-indigo-300 group-hover:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setPagesPerCategory(Math.max(1, pagesPerCategory - 1))}
                            className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg border border-indigo-500/30 hover:border-indigo-500/50 transition-all group"
                          >
                            <svg className="w-4 h-4 text-indigo-300 group-hover:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Range Slider */}
                      <div className="mt-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={pagesPerCategory}
                          onChange={(e) => setPagesPerCategory(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${((pagesPerCategory - 1) / 9) * 100}%, rgb(51 65 85 / 0.5) ${((pagesPerCategory - 1) / 9) * 100}%, rgb(51 65 85 / 0.5) 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-white/50 mt-2 px-0.5">
                          <span className={pagesPerCategory === 1 ? 'text-indigo-400 font-semibold' : ''}>1</span>
                          <span className={pagesPerCategory === 5 ? 'text-indigo-400 font-semibold' : ''}>5</span>
                          <span className={pagesPerCategory === 10 ? 'text-indigo-400 font-semibold' : ''}>10</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Info Box */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-4">
                      <div className="text-sm text-indigo-100 space-y-2">
                        <p className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                          <span className="text-white/90">4 categories</span>
                          <span className="text-white/50 text-xs">(Popular, Top Rated, etc.)</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                          <span className="text-white/90">~20 movies per page</span>
                        </p>
                        <div className="pt-3 mt-3 border-t border-indigo-500/30">
                          <div className="flex items-baseline justify-between">
                            <span className="text-white/70 text-xs font-medium">Estimated total:</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-white">{estimatedMovies}</span>
                              <span className="text-sm text-white/60">movies</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-2">Quick Presets</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 3, 5].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setPagesPerCategory(preset)}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                              pagesPerCategory === preset
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {lastSync && !syncing && (
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-full shadow-sm backdrop-blur">
            <div className="flex items-center gap-2">
              {lastSync.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <Clock className="w-4 h-4 text-indigo-200" />
              )}
              <div className="text-sm text-indigo-100/80">
                <span>Last sync:</span>
                <span className="ml-1 font-medium text-white">
                  {formatDistanceToNow(new Date(lastSync.synced_at), { addSuffix: true })}
                </span>
                <span className="ml-1 text-indigo-200/60">
                  {format(new Date(lastSync.synced_at), 'HH:mm')}
                </span>
              </div>
            </div>
            
            {showDetails && (
              <div className="ml-2 pl-2 border-l border-white/20 text-xs text-indigo-100/80">
                <span className="text-emerald-200 font-semibold">+{lastSync.records_created}</span>
                {' / '}
                <span className="text-indigo-200 font-semibold">~{lastSync.records_updated}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {mounted && shouldRenderModal && syncResult && createPortal(
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
            isModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            zIndex: 2147483647,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div
            className={`relative bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-8 shadow-2xl border border-white/10 transition-all duration-300 ${
              isModalAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}
          >
            {/* Close button */}
            <button
              onClick={closeSuccessModal}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center text-white">
              {/* Success icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" strokeWidth={2} />
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-semibold mb-2 text-white">
                Sync Complete
              </h2>
              <p className="text-slate-400 mb-6 text-sm">
                Data synchronized from TMDB
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-center gap-6 mb-6 py-4 border-y border-white/10">
                <div>
                  <p className="text-2xl font-semibold text-white">{fetched}</p>
                  <p className="text-xs text-slate-400">Fetched</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-semibold text-emerald-400">{created}</p>
                  <p className="text-xs text-slate-400">New</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-semibold text-indigo-400">{updated}</p>
                  <p className="text-xs text-slate-400">Updated</p>
                </div>
              </div>
              
              {/* Continue button */}
              <button
                onClick={closeSuccessModal}
                className="w-full px-6 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-all font-medium text-sm"
              >
                Continue
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
