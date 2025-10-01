import { useState, useRef } from 'react';
import { Download, Clipboard, Zap, Film, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstagramReelDownloader() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef(null);

  const validateInstagramURL = (url) => {
    const patterns = [
      /^https?:\/\/(www\.)?instagram\.com\/reels\/[\w-]+\/?/,
      /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const showError = (message) => {
    toast.error(message)
    setSuccess('');
  };

  const showSuccess = (message) => {
    toast.success(message);
    setError('');

  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      inputRef.current?.focus();
    } catch (err) {
      showError('Unable to paste from clipboard. Please paste manually.');
    }
  };

  const downloadReel = async () => {
    if (isDownloading) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      showError('Please enter an Instagram reel URL');
      return;
    }

    if (!validateInstagramURL(trimmedUrl)) {
      showError('Please enter a valid Instagram reel or post URL');
      return;
    }


    setIsDownloading(true)
    try {
      const response = await fetch("https://reel-grab-be.vercel.app/reel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url
        })
      })
      const data = await response.json()
      if (data.success) {
        toast('Download Started!',
          {
            icon: '👏',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
        const videoUrl = data?.msg?.video[0]?.video
        if (videoUrl) {
          const response = await fetch(videoUrl);
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl
          a.download = 'instagram-reel.mp4';
          a.click()
          showSuccess('Reel downloaded successfully!');
        }
        else {
          showError("Video URl is not Found")
        }

      }
      else {
        showError(data.msg)
      }


    } catch (error) {
      showError('Failed to download reel. Please try again.');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isDownloading) {
      downloadReel();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex flex-col">
      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto w-full">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                ReelGrab
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-light">
              Download Instagram Reels in seconds
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-all duration-300 mb-8 sm:mb-12">

            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label htmlFor="reelUrl" className="block text-lg font-semibold text-gray-700 mb-4">
                  Enter Instagram Reel URL
                </label>

                <div className="relative">
                  <input
                    ref={inputRef}
                    type="url"
                    id="reelUrl"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isDownloading}
                    className="w-full px-4 sm:px-6 py-4 text-base sm:text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white pr-20 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://www.instagram.com/reel/..."
                    autoComplete="off"
                  />

                  <button
                    onClick={pasteFromClipboard}
                    disabled={isDownloading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-semibold"
                  >
                    <Clipboard size={16} />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={downloadReel}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 sm:py-5 px-8 text-lg font-bold rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-3 uppercase tracking-wide"
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Download Reel</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 text-center text-white hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-4xl sm:text-5xl mb-4">
                <Zap className="mx-auto text-yellow-400" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-white/90 leading-relaxed">
                Download your favorite reels in seconds with our optimized servers
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 text-center text-white hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-4xl sm:text-5xl mb-4">
                <Film className="mx-auto text-pink-400" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">High Quality</h3>
              <p className="text-white/90 leading-relaxed">
                Get reels in their original quality without any compression
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 text-center text-white hover:transform hover:-translate-y-2 transition-all duration-300 md:col-span-1 col-span-1">
              <div className="text-4xl sm:text-5xl mb-4">
                <Shield className="mx-auto text-green-400" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-white/90 leading-relaxed">
                We don't store your data. Everything is processed securely
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-white/80 py-6 sm:py-8 px-4">
        <p className="text-sm sm:text-base">
          &copy; 2024 ReelGrab. Made with ❤️ for Instagram lovers
        </p>
      </footer>
    </div>
  );
}