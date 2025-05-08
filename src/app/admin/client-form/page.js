'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientInfoForm from '../../components/ClientInfoForm';

export default function ClientFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setMessage({ type: 'info', text: 'Saving client information and starting content generation...' });

    try {
      // Save client info
      await fetch('/api/client-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Start orchestration process
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          clientInfo: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start content generation');
      }

      setMessage({ 
        type: 'success', 
        text: 'Content generation started successfully! Redirecting to admin dashboard...' 
      });

      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ 
        type: 'error', 
        text: `An error occurred: ${error.message}` 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <Link 
          href="/admin"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center gap-2 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Client Information Form</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
          message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
          'bg-blue-100 text-blue-800 border border-blue-300'
        }`}>
          {message.text}
        </div>
      )}
      
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Fill out this form with your client&apos;s information to automatically generate website content
        tailored to their business needs.
      </p>
      
      <ClientInfoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      
      <div className="mt-8 text-center">
        <a 
          href="/admin"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Return to Admin Dashboard
        </a>
      </div>
    </div>
  );
}