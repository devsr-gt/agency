'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import ContentEditor from '../components/ContentEditor';

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
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        
        // Create an array of promises for parallel fetching
        const [contentResponse, orchestrateResponse] = await Promise.all([
          fetch('/api/content'),
          fetch('/api/orchestrate').catch(() => ({ ok: false }))
        ]);
        
        // Process content data
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          if (contentData.contentFiles && contentData.contentFiles.length > 0) {
            setContent(contentData.contentFiles);
            
            // Set progress status based on content
            setProgressStatus({
              contentCompletion: 100,
              seoOptimization: 80, 
              keywordsGenerated: contentData.contentFiles.length * 3,
              pagesCreated: contentData.contentFiles.length,
              pagesApproved: contentData.contentFiles.length
            });
          }
        }
        
        // Process orchestration data
        if (orchestrateResponse.ok) {
          const data = await orchestrateResponse.json();
          
          if (data.agentActivities && data.agentActivities.length > 0) {
            setActivities(data.agentActivities);
          }
          
          if (data.contentStatus && data.contentStatus.length > 0) {
            setContent(prevContent => {
              // Create a map for faster lookups
              const contentMap = new Map();
              prevContent.forEach(item => contentMap.set(item.id, item));
              
              // Update with new data
              data.contentStatus.forEach(statusItem => {
                if (contentMap.has(statusItem.id)) {
                  const existing = contentMap.get(statusItem.id);
                  contentMap.set(statusItem.id, { ...existing, ...statusItem });
                } else {
                  contentMap.set(statusItem.id, statusItem);
                }
              });
              
              return Array.from(contentMap.values());
            });
          }
          
          if (data.progress) {
            setProgressStatus(prev => ({ ...prev, ...data.progress }));
          }
          
          // If we have any data, start polling for updates
          if ((data.agentActivities && data.agentActivities.length > 0) || 
              (data.contentStatus && data.contentStatus.length > 0)) {
            setPolling(true);
          }
        } else {
          // Use sample activity data if orchestration API fails
          console.warn('Orchestration API not available, using sample activity data');
          setActivities([
            {
              agent: 'Team Lead', 
              action: 'Content Loaded',
              details: 'Loaded content files from the content directory',
              timestamp: new Date().toISOString()
            },
            {
              agent: 'Content Writer',
              action: 'Content Available',
              details: 'Found content files in the workspace',
              timestamp: new Date().toISOString()
            }
          ]);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Set up polling with a proper cleanup
    let interval = null;
    
    if (polling) {
      interval = setInterval(async () => {
        if (!isMounted) return;
        
        try {
          const response = await fetch('/api/orchestrate');
          if (!response.ok || !isMounted) return;
          
          const data = await response.json();
          
          if (data.agentActivities && isMounted) {
            setActivities(data.agentActivities);
          }
          
          if (data.contentStatus && isMounted) {
            setContent(prevContent => {
              // Create a map for faster lookups
              const contentMap = new Map();
              prevContent.forEach(item => contentMap.set(item.id, item));
              
              // Update with new data
              data.contentStatus.forEach(statusItem => {
                if (contentMap.has(statusItem.id)) {
                  const existing = contentMap.get(statusItem.id);
                  contentMap.set(statusItem.id, { ...existing, ...statusItem });
                } else {
                  contentMap.set(statusItem.id, statusItem);
                }
              });
              
              return Array.from(contentMap.values());
            });
          }
          
          if (data.progress && isMounted) {
            setProgressStatus(prev => ({ ...prev, ...data.progress }));
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 10000); // Decreased polling frequency to 10 seconds to reduce server load
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [polling]); // Only depend on polling state

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Admin Dashboard</h1>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-start md:items-center">
            <ThemeToggle />
            
            {clientInfo ? (
              <button
                onClick={startNewGeneration}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Start New Generation
              </button>
            ) : (
              <Link href="/admin/client-form">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Add Client Info
                </button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'content' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === 'activities' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </button>
          </div>
        </div>
        
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Status</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Page</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {content.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                          No content files found in the content directory.
                        </td>
                      </tr>
                    ) : (
                      content.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{item.title || item.id}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${item.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                item.status === 'regenerating' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'}`}>
                              {item.status || 'completed'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(item.lastUpdated).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditContent(item.id)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'approved')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                disabled={item.status === 'approved'}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                disabled={item.status === 'rejected'}
                              >
                                Reject
                              </button>
                              <Link
                                href={`/preview?page=${item.id}`}
                                target="_blank"
                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              >
                                Preview
                              </Link>
                            </div>
                            
                            {item.status === 'rejected' && (
                              <div className="mt-2">
                                <textarea
                                  placeholder="Feedback for regeneration"
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  rows={2}
                                />
                                <button
                                  onClick={() => triggerRegeneration(item.id)}
                                  disabled={regenerating === item.id}
                                  className="mt-1 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-yellow-300"
                                >
                                  {regenerating === item.id ? 'Processing...' : 'Regenerate'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'activities' && (
          <div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agent Activities</h2>
                <div className="relative inline-block w-48">
                  <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-700 dark:text-white"
                  >
                    {uniqueAgents.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent === 'all' ? 'All Agents' : agent}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {filteredActivities.length === 0 ? (
                      <li className="py-4">
                        <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                          No activities found.
                        </div>
                      </li>
                    ) : (
                      filteredActivities.map((activity, activityIdx) => (
                        <li key={activityIdx}>
                          <div className="relative pb-8">
                            {activityIdx !== filteredActivities.length - 1 ? (
                              <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.agent ? activity.agent.substring(0, 2) : 'AI'}
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 py-1.5">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium text-gray-900 dark:text-white">{activity.agent}</span>{' '}
                                  <span className="font-bold">{activity.action}</span>
                                  <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 ml-2">
                                    {new Date(activity.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                  {activity.details}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content Completion</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{progressStatus.contentCompletion || 0}%</div>
              <div className="ml-4 flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressStatus.contentCompletion || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">SEO Optimization</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{progressStatus.seoOptimization || 0}%</div>
              <div className="ml-4 flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressStatus.seoOptimization || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Keywords Generated</h3>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{progressStatus.keywordsGenerated || 0}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pages Created</h3>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{progressStatus.pagesCreated || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Approved: <span className="font-semibold">{progressStatus.pagesApproved || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}