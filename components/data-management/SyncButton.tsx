'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RefreshCw, Clock, CheckCircle2, TrendingUp, Plus, RotateCw, X } from 'lucide-react';
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
