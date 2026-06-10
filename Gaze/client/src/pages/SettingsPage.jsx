import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Copy, Plus, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [domain, setDomain] = useState('');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = async () => {
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:3000/api/sites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSites(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [getToken]);

  const handleCreateSite = async (e) => {
    e.preventDefault();
    if (!domain) return;
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:3000/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ domain })
      });
      if (res.ok) {
        setDomain('');
        fetchSites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateScriptTag = (siteId) => {
    return `<script src="http://localhost:3000/sdk.js" data-site-id="${siteId}" data-ingress-url="http://localhost:3000"></script>`;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12 p-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Project Settings</h1>
        <p className="text-zinc-400">Manage your tracked domains and SDK installation keys.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          Register New Domain
        </h2>
        <form onSubmit={handleCreateSite} className="flex gap-4">
          <input
            type="text"
            placeholder="e.g. app.yourdomain.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 bg-[#0d0d12] border border-white/10 rounded-lg px-4 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
          />
          <button
            type="submit"
            disabled={!domain}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Domain
          </button>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-6">Registered Sites</h2>
        
        {loading ? (
          <div className="text-zinc-500">Loading your sites...</div>
        ) : sites.length === 0 ? (
          <div className="text-zinc-500">No sites registered yet. Add a domain above to get started.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {sites.map(site => (
              <div key={site.id} className="bg-[#0d0d12]/50 border border-white/5 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-indigo-300 font-medium text-lg">{site.domain}</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Site ID: {site.id}</p>
                  </div>
                </div>
                
                <div className="bg-black/40 rounded border border-white/10 p-3 relative group">
                  <pre className="text-xs text-zinc-400 font-mono overflow-x-auto custom-scrollbar pb-2">
                    {generateScriptTag(site.id)}
                  </pre>
                  <button 
                    onClick={() => handleCopy(generateScriptTag(site.id))}
                    className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-zinc-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
