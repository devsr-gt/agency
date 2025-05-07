'use client';

import { useState, useEffect } from 'react';

export default function ContentEditor({ content, pageId, onSave, onCancel }) {
  const [editedContent, setEditedContent] = useState(content);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSave = async () => {
    if (!editedContent.trim()) return;
    
    setSaving(true);
    await onSave(pageId, editedContent);
    setSaving(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Content</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="prose dark:prose-invert max-w-none border p-4 rounded-md bg-gray-50 dark:bg-gray-900 min-h-[300px] overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(editedContent) }} />
        </div>
      ) : (
        <textarea
          value={editedContent}
          onChange={handleContentChange}
          className="w-full h-[500px] p-4 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
        />
      )}

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Simple markdown to HTML converter for preview functionality
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  // Convert headings
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Convert paragraph breaks
    .replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /\<(\/)?(h|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
    })
    
    // Convert links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    
    // Convert bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    
    // Convert italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Convert lists
    .replace(/^\s*\*\s(.+)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n)+/gim, function(match) {
      return '<ul>' + match + '</ul>';
    })
    
    // Convert code blocks
    .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
    
    // Convert inline code
    .replace(/`([^`]+)`/gim, '<code>$1</code>');
    
  return html;
}