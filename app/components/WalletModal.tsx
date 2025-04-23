'use client';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function WalletModal({ isOpen, onClose, onConnect, isLoading, error }: WalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="glass rounded-xl p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>
        <p className="text-sm text-white/70 mb-6">
          Connect your Phantom wallet to start trading
        </p>
        <button
          onClick={onConnect}
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? 'Connecting...' : 'Connect Phantom Wallet'}
        </button>
        {error && (
          <div className="mt-4 text-sm text-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 