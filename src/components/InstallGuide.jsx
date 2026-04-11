import { useState, useEffect } from 'react';

function getDeviceType() {
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 0) return 'ios'; // iPad with desktop UA
  if (/Android/.test(ua)) return 'android';
  if (/Macintosh|Mac OS X/.test(ua)) return 'mac';
  return 'desktop';
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

export default function InstallGuide({ onClose }) {
  const [device, setDevice] = useState('ios');

  useEffect(() => {
    setDevice(getDeviceType());
  }, []);

  // Don't show if already installed as PWA
  if (isStandalone()) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-coffee-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" alt="BrewFind" className="w-12 h-12 rounded-xl" />
            <div>
              <h3 className="font-bold text-coffee-800 dark:text-coffee-100 text-lg">Install BrewFind</h3>
              <p className="text-coffee-400 dark:text-coffee-500 text-sm">Add to your home screen</p>
            </div>
          </div>
          <button onClick={onClose} className="text-coffee-400 hover:text-coffee-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Instructions */}
        <div className="p-5">
          {device === 'ios' && (
            <div className="space-y-4">
              <p className="text-sm text-coffee-600 dark:text-coffee-300 font-medium">On iPhone or iPad:</p>
              <div className="space-y-3">
                <Step number={1}>
                  Open this page in <strong>Safari</strong> (not from a text message or email link)
                </Step>
                <Step number={2}>
                  Tap the <strong>Share button</strong> <ShareIcon /> at the bottom of the screen
                </Step>
                <Step number={3}>
                  Scroll down and tap <strong>"Add to Home Screen"</strong> <AddIcon />
                </Step>
                <Step number={4}>
                  Tap <strong>"Add"</strong> in the top right corner
                </Step>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-3 mt-4">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Tip:</strong> Once installed, BrewFind will open like a real app — full screen with no browser bar, and the icon will appear on your home screen.
                </p>
              </div>
            </div>
          )}

          {device === 'android' && (
            <div className="space-y-4">
              <p className="text-sm text-coffee-600 dark:text-coffee-300 font-medium">On Android:</p>
              <div className="space-y-3">
                <Step number={1}>
                  Open this page in <strong>Chrome</strong>
                </Step>
                <Step number={2}>
                  Tap the <strong>three-dot menu</strong> &#8942; in the top right
                </Step>
                <Step number={3}>
                  Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>
                </Step>
                <Step number={4}>
                  Tap <strong>"Install"</strong> to confirm
                </Step>
              </div>
            </div>
          )}

          {device === 'mac' && (
            <div className="space-y-4">
              <p className="text-sm text-coffee-600 dark:text-coffee-300 font-medium">On Mac:</p>
              <div className="space-y-3">
                <Step number={1}>
                  Open this page in <strong>Safari</strong> or <strong>Chrome</strong>
                </Step>
                <Step number={2}>
                  <strong>In Safari:</strong> Click <strong>File</strong> &rarr; <strong>"Add to Dock"</strong>
                </Step>
                <Step number={3}>
                  <strong>In Chrome:</strong> Click the <strong>install icon</strong> in the address bar, or go to &#8942; &rarr; <strong>"Install BrewFind"</strong>
                </Step>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-3 mt-4">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Tip:</strong> The app will appear in your Dock and Launchpad just like a regular app.
                </p>
              </div>
            </div>
          )}

          {device === 'desktop' && (
            <div className="space-y-4">
              <p className="text-sm text-coffee-600 dark:text-coffee-300 font-medium">On Desktop:</p>
              <div className="space-y-3">
                <Step number={1}>
                  Open this page in <strong>Chrome</strong> or <strong>Edge</strong>
                </Step>
                <Step number={2}>
                  Look for the <strong>install icon</strong> in the address bar (or click &#8942; menu)
                </Step>
                <Step number={3}>
                  Click <strong>"Install BrewFind"</strong>
                </Step>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-coffee-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-coffee-700 hover:bg-coffee-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ number, children }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-coffee-700 text-white text-sm font-bold flex items-center justify-center">
        {number}
      </span>
      <p className="text-sm text-coffee-700 dark:text-coffee-200 pt-0.5">{children}</p>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg className="inline w-4 h-4 ml-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg className="inline w-4 h-4 ml-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
