'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RefreshCw, Clock, CheckCircle2, TrendingUp, Plus, RotateCw, X } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

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
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
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

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold hover:-translate-y-0.5"
        >
          <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Data'}
        </button>
        
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
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div
            className={`relative bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-xl rounded-3xl max-w-lg w-full p-10 shadow-2xl border border-white/20 transition-all duration-300 ${
              isModalAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}
          >
            {/* Close button */}
            <button
              onClick={closeSuccessModal}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-white/10 text-indigo-200 hover:text-white transition-all hover:rotate-90 duration-300"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center text-white">
              {/* Success icon with animation */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 border-4 border-emerald-400/30">
                  <CheckCircle2 className="w-12 h-12 text-white animate-scale-in" strokeWidth={2.5} />
                </div>
              </div>
              
              {/* Title */}
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                Sync Successful!
              </h2>
              <p className="text-indigo-200/90 mb-8 text-lg">
                Data synchronized from TMDB
              </p>
              
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-2xl p-5 border border-indigo-400/30 hover:border-indigo-400/50 transition-all hover:scale-105 backdrop-blur">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
                      <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{fetched}</p>
                  <p className="text-sm text-indigo-200/80 font-medium">Fetched</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl p-5 border border-emerald-400/30 hover:border-emerald-400/50 transition-all hover:scale-105 backdrop-blur">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                      <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{created}</p>
                  <p className="text-sm text-emerald-200/80 font-medium">New</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-5 border border-purple-400/30 hover:border-purple-400/50 transition-all hover:scale-105 backdrop-blur">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
                      <RotateCw className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{updated}</p>
                  <p className="text-sm text-purple-200/80 font-medium">Updated</p>
                </div>
              </div>
              
              {/* Success message */}
              <div className="bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 border border-emerald-400/40 rounded-xl p-4 mb-8 backdrop-blur">
                <p className="text-emerald-100 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Your movie database is now up to date
                </p>
              </div>
              
              {/* Continue button */}
              <button
                onClick={closeSuccessModal}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-400 hover:to-indigo-500 transition-all font-semibold text-lg shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:-translate-y-0.5 active:scale-95"
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
