'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import ContentEditor from '../components/ContentEditor';
import Image from 'next/image';

export default function AdminDashboard() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('content');
  const [regenerating, setRegenerating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [polling, setPolling] = useState(false);
  const [clientInfo] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [currentContent, setCurrentContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [progressStatus, setProgressStatus] = useState({});
  const [agentFilter, setAgentFilter] = useState('all');

  // Fetch data from API endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orchestration status data
        const response = await fetch('/api/orchestrate');
        if (response.ok) {
          const data = await response.json();
          
          if (data.agentActivities && data.agentActivities.length > 0) {
            setActivities(data.agentActivities);
          }
          
          if (data.contentStatus && data.contentStatus.length > 0) {
            setContent(data.contentStatus);
          }
          
          if (data.progress) {
            setProgressStatus(data.progress);
          }
          
          // If we have any data, start polling for updates
          if ((data.agentActivities && data.agentActivities.length > 0) || 
              (data.contentStatus && data.contentStatus.length > 0)) {
            setPolling(true);
          }
        } else {
          // If API call fails, use sample data
          console.warn('API not available, using sample data');
          setContent([
            { 
              id: 'homepage',
              title: 'Homepage',
              status: 'approved',
              lastUpdated: '2025-05-07T10:30:00Z',
              author: 'Content Writer Agent'
            },
            { 
              id: 'sample',
              title: 'Sample Page',
              status: 'pending',
              lastUpdated: '2025-05-07T09:15:00Z',
              author: 'Content Writer Agent'
            }
          ]);
          
          setActivities([
            {
              agent: 'Team Lead', 
              action: 'Created',
              details: 'Assistant created with ID: asst_abc123',
              timestamp: '2025-05-07T09:00:00Z'
            },
            {
              agent: 'SEO Manager',
              action: 'Keywords Generated',
              details: 'Generated 15 keywords for criminal defense and personal injury',
              timestamp: '2025-05-07T09:10:00Z'
            },
            {
              agent: 'Content Writer',
              action: 'Content Created',
              details: 'Created homepage content with 1200 words',
              timestamp: '2025-05-07T09:30:00Z'
            },
            {
              agent: 'Editor',
              action: 'Review Complete',
              details: 'Content approved with minor revisions',
              timestamp: '2025-05-07T10:00:00Z'
            }
          ]);
          
          setProgressStatus({
            contentCompletion: 75,
            seoOptimization: 60,
            keywordsGenerated: 15,
            pagesCreated: 2,
            pagesApproved: 1
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling if enabled
    let interval;
    if (polling) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/orchestrate');
          if (response.ok) {
            const data = await response.json();
            if (data.agentActivities) setActivities(data.agentActivities);
            if (data.contentStatus) setContent(data.contentStatus);
            if (data.progress) setProgressStatus(data.progress);
          }
        } catch (_error) {
          console.error('Polling error:', _error);
        }
      }, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling]);

  // Function to trigger content regeneration
  const triggerRegeneration = async (id) => {
    if (regenerating === id) return;
    
    setRegenerating(id);
    
    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'regenerate',
          pageId: id,
          feedback: feedback || 'Please improve this content.'
        }),
      });
      
      if (response.ok) {
        // Update local state to show regenerating status
        setContent(content.map(item => 
          item.id === id ? { ...item, status: 'regenerating' } : item
        ));
        
        // Start polling for updates if not already
        setPolling(true);
      } else {
        const errorData = await response.json();
        console.error('Regeneration failed:', errorData.error);
        alert(`Regeneration failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      alert('Failed to start regeneration process');
    } finally {
      setRegenerating(null);
      setFeedback('');
    }
  };

  // Function to update content status
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update local state immediately for responsive UI
      setContent(content.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
      
      // Call API endpoint to persist the status
      const response = await fetch('/api/content/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: id,
          status: newStatus
        }),
      }).catch(_error => { // Changed 'error' to '_error' as it's not used in the log below
        console.log('Status update API not implemented, simulating success');
        return { ok: true };
      });
      
      if (!response.ok) {
        // Revert status if update fails
        setContent(content); // Revert to original content state on failure
        alert('Failed to update content status');
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  // Function to edit content
  const handleEditContent = async (id) => {
    setLoadingContent(true);
    setEditingContent(id);
    
    try {
      const response = await fetch(`/api/content?pageId=${id}`);
      
      if (response.ok) {
        const { content } = await response.json();
        setCurrentContent(content);
      } else {
        // If API fails, provide a placeholder
        console.warn('Content API not available, using placeholder');
        setCurrentContent('# Sample Content\n\nThis is a placeholder for the actual content. The API to fetch content is not currently available.');
      }
    } catch (err) {
      console.error('Content fetch error:', err);
      setCurrentContent('# Error\n\nFailed to load content. Please try again later.');
    } finally {
      setLoadingContent(false);
    }
  };

  // Function to save edited content
  const handleSaveContent = async (id, content) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: id,
          content
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local content state with new timestamp
        setContent(prevContent => 
          prevContent.map(item => 
            item.id === id ? { ...item, lastUpdated: data.lastUpdated } : item
          )
        );
        
        setEditingContent(null);
        setCurrentContent('');
        alert('Content updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to save content: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save content. Please try again later.');
    }
  };

  // Function to run the orchestration process with client info
  const startNewGeneration = async () => {
    try {
      // Redirect to client info form if no client info
      if (!clientInfo) {
        window.location.href = '/admin/client-form';
        return;
      }
      
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          clientInfo
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`${data.message} for ${data.clientInfo}`);
        
        // Start polling for updates
        setPolling(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to start generation: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to start generation process');
    }
  };

  // Get unique agent types for filtering
  const uniqueAgents = activities.length > 0 
    ? ['all', ...new Set(activities.map(activity => activity.agent))] 
    : ['all'];

  const filteredActivities = agentFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.agent === agentFilter);

  if (loadingContent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-700 dark:text-gray-300">Loading content...</span>
      </div>
    );
  }

  if (editingContent) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Content: {content.find(item => item.id === editingContent)?.title}
          </h1>
          <ThemeToggle />
        </div>
        
        <ContentEditor 
          content={currentContent}
          pageId={editingContent}
          onSave={handleSaveContent}
          onCancel={() => {
            setEditingContent(null);
            setCurrentContent('');
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center">
            <div className="mr-4">
              <Image 
                src="/wumpus/logo.svg" 
                alt="Wumpus Logo" 
                width={140} 
                height={46}
                className="h-auto w-auto"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white sr-only">Wumpus Dashboard</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor AI-generated content and agent activities
          </p>
          {clientInfo && (
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              Client: {clientInfo.businessName} - {clientInfo.industry?.charAt(0).toUpperCase() + clientInfo.industry?.slice(1)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.5 0a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0V1.207l5.146 5.147a.5.5 0 0 0 .708-.708L9.707.5a.5.5 0 0 0-.354-.146z"/>
              <path d="M7.5 0a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V1.207L1.854 6.354a.5.5 0 1 1-.708-.708L6.293.5A.5.5 0 0 1 7.5 0z"/>
              <path d="M0 8a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15A.5.5 0 0 1 0 8z"/>
            </svg>
            View Site
          </Link>
          <ThemeToggle />
          <Link href="/" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg shadow transition-colors">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Progress Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Content Completion</div>
            <div className="mt-2 flex items-center">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">{progressStatus.contentCompletion || 0}%</div>
              <div className="ml-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressStatus.contentCompletion || 0}%` }}></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 text-sm">SEO Optimization</div>
            <div className="mt-2 flex items-center">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">{progressStatus.seoOptimization || 0}%</div>
              <div className="ml-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressStatus.seoOptimization || 0}%` }}></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Keywords Generated</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{progressStatus.keywordsGenerated || 0}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Pages Created</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{progressStatus.pagesCreated || 0}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Pages Approved</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{progressStatus.pagesApproved || 0}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('content')}
            className={`inline-block p-4 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Content Pages
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`inline-block p-4 border-b-2 font-medium text-sm ${
              activeTab === 'activities'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Agent Activities
          </button>
        </nav>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Content Management</h2>
            <button
              onClick={startNewGeneration}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
              </svg>
              {clientInfo ? 'Generate New Content' : 'Add Client Info'}
            </button>
          </div>
          
          {content.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg mb-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {content.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                          item.status === 'regenerating' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.lastUpdated).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            onClick={() => handleEditContent(item.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-colors"
                          >
                            Edit
                          </button>
                          <Link 
                            href={`/preview/${item.id}`}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded shadow transition-colors flex items-center"
                          >
                            Preview
                          </Link>
                          {item.status !== 'regenerating' ? (
                            <button
                              onClick={() => triggerRegeneration(item.id)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded shadow transition-colors"
                              disabled={regenerating === item.id}
                            >
                              {regenerating === item.id ? 'Processing...' : 'Regenerate'}
                            </button>
                          ) : (
                            <span className="px-3 py-1 bg-gray-400 text-white rounded shadow">Regenerating...</span>
                          )}
                          {item.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'approved')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow transition-colors"
                            >
                              Publish
                            </button>
                          )}
                          {item.status === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'pending')}
                              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow transition-colors"
                            >
                              Unpublish
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No content pages found.</p>
              <button
                onClick={startNewGeneration}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {clientInfo ? 'Generate New Content' : 'Add Client Info'}
              </button>
            </div>
          )}
          
          {/* Content Regeneration Feedback Section */}
          {regenerating && (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-4 sm:p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Regeneration Feedback</h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter specific feedback for regenerating this content..."
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md h-24 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => setRegenerating(null)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => triggerRegeneration(regenerating)}
                  className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
                >
                  Submit & Regenerate
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Activities Log</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">Filter by agent:</span>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueAgents.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent === 'all' ? 'All Agents' : agent}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredActivities.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredActivities.map((activity, index) => (
                      <tr 
                        key={index} 
                        className={index === 0 ? "bg-blue-50 dark:bg-blue-900/30" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <time dateTime={activity.timestamp}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </time>
                          {index === 0 && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Latest
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            activity.agent === 'Team Lead' ? 'text-purple-600 dark:text-purple-400' :
                            activity.agent === 'SEO Manager' ? 'text-green-600 dark:text-green-400' :
                            activity.agent === 'Content Writer' ? 'text-blue-600 dark:text-blue-400' :
                            activity.agent === 'Editor' ? 'text-amber-600 dark:text-amber-400' :
                            'text-gray-900 dark:text-white'
                          }`}>
                            {activity.agent}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {activity.action}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {activity.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Timeline Visualization */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Timeline Visualization</h3>
                <div className="relative">
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  {filteredActivities.map((activity, index) => (
                    <div key={index} className="relative pl-8 pb-6">
                      <div className={`absolute left-0 -ml-1 mt-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                        activity.agent === 'Team Lead' ? 'bg-purple-600' :
                        activity.agent === 'SEO Manager' ? 'bg-green-600' :
                        activity.agent === 'Content Writer' ? 'bg-blue-600' :
                        activity.agent === 'Editor' ? 'bg-amber-600' :
                        'bg-gray-600'
                      }`}></div>
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <div className="mb-2 sm:mb-0 sm:mr-4 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleTimeString()} <br />
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <div className={`inline-flex mr-2 px-2 py-1 text-xs font-semibold rounded ${
                              activity.agent === 'Team Lead' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                              activity.agent === 'SEO Manager' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              activity.agent === 'Content Writer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              activity.agent === 'Editor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {activity.agent}
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.action}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No agent activities found.</p>
              {!polling && (
                <button
                  onClick={startNewGeneration}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {clientInfo ? 'Start Generation Process' : 'Add Client Info'}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}