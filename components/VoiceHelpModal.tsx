
import React from 'react';
import { X, Monitor, Smartphone, Globe } from 'lucide-react';

interface VoiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceHelpModal: React.FC<VoiceHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="text-blue-600" />
            Enable Local Language Voices
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm">
            <strong>Note:</strong> This application uses your device's built-in text-to-speech engine. If you don't hear Telugu or Hindi, you may need to install the language pack.
          </div>

          {/* Windows */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Monitor className="text-slate-500" /> Windows 10 / 11
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
              <li>Open <strong>Settings</strong> via Start Menu.</li>
              <li>Go to <strong>Time & Language</strong> {'>'} <strong>Language & region</strong>.</li>
              <li>Click <strong>Add a language</strong>.</li>
              <li>Search for <strong>Telugu</strong> or <strong>Hindi</strong>.</li>
              <li>Select it and click <strong>Next</strong>.</li>
              <li>Ensure <strong>"Text-to-speech"</strong> is checked in the optional features.</li>
              <li>Click <strong>Install</strong> and wait for it to finish.</li>
              <li><strong>Restart your browser</strong> completely.</li>
            </ol>
          </section>

          <hr className="border-slate-100" />

          {/* macOS */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Monitor className="text-slate-500" /> macOS
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
              <li>Open <strong>System Settings</strong> (or System Preferences).</li>
              <li>Go to <strong>Accessibility</strong> {'>'} <strong>Spoken Content</strong>.</li>
              <li>Click the drop-down menu for <strong>System Voice</strong>.</li>
              <li>Select <strong>Manage Voices...</strong>.</li>
              <li>Search for <strong>Telugu</strong> or <strong>Hindi</strong>.</li>
              <li>Click the <strong>Download icon</strong> (cloud/arrow) next to the voice (e.g., "Rishi" for Hindi, "Geeta" for Telugu).</li>
              <li>Wait for download to complete and <strong>Restart your browser</strong>.</li>
            </ol>
          </section>

          <hr className="border-slate-100" />

          {/* Android */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Smartphone className="text-slate-500" /> Android
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
              <li>Open <strong>Settings</strong> app.</li>
              <li>Search for <strong>Text-to-speech output</strong>.</li>
              <li>Tap the <strong>Settings gear</strong> next to "Preferred engine" (usually Google).</li>
              <li>Tap <strong>Install voice data</strong>.</li>
              <li>Find <strong>Telugu</strong> or <strong>Hindi</strong> and tap download.</li>
            </ol>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoiceHelpModal;
