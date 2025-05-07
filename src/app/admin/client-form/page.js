'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientInfoForm from '../../components/ClientInfoForm';

export default function ClientFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // First, save the client info
      const saveResponse = await fetch('/api/client-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save client information');
      }
      
      // Then, start the orchestration process
      const orchestrateResponse = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          clientInfo: formData
        }),
      });

      if (!orchestrateResponse.ok) {
        throw new Error('Failed to start content generation');
      }

      const data = await orchestrateResponse.json();
      alert(`Content generation started successfully: ${data.message}`);
      
      // Redirect back to admin dashboard to see progress
      router.push('/admin');
    } catch (error) {
      console.error('Error during form submission:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Information Form</h1>
        <Link 
          href="/admin" 
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Fill in the client details below to generate website content optimized for their business.
          Fields marked with * are required.
        </p>
      </div>
      
      <ClientInfoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}