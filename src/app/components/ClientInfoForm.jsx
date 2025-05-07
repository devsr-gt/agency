'use client';

import { useState } from 'react';

export default function ClientInfoForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'law',
    practiceAreas: '',
    targetAudience: '',
    competitors: '',
    uniqueSellingPoints: '',
    tone: 'professional',
    existingContent: '',
    additionalNotes: ''
  });

  const industries = [
    { value: 'law', label: 'Legal Services' },
    { value: 'medical', label: 'Medical Practice' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'tech', label: 'Technology' },
    { value: 'retail', label: 'Retail' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'other', label: 'Other' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly/Approachable' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'technical', label: 'Technical' },
    { value: 'compassionate', label: 'Compassionate' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Client Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Name*
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Industry*
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            >
              {industries.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Practice Areas (for law firms) */}
          {formData.industry === 'law' && (
            <div>
              <label htmlFor="practiceAreas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Practice Areas*
              </label>
              <textarea
                id="practiceAreas"
                name="practiceAreas"
                value={formData.practiceAreas}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Criminal Defense, Personal Injury, Family Law, etc."
                required
              />
            </div>
          )}

          {/* Target Audience */}
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Describe your ideal clients and customers"
            />
          </div>

          {/* Competitors */}
          <div>
            <label htmlFor="competitors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Main Competitors
            </label>
            <textarea
              id="competitors"
              name="competitors"
              value={formData.competitors}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="List your main competitors (websites if available)"
            />
          </div>

          {/* Unique Selling Points */}
          <div>
            <label htmlFor="uniqueSellingPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unique Selling Points*
            </label>
            <textarea
              id="uniqueSellingPoints"
              name="uniqueSellingPoints"
              value={formData.uniqueSellingPoints}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="What makes your business different? Experience, specialization, approach, etc."
              required
            />
          </div>

          {/* Content Tone */}
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preferred Content Tone*
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            >
              {toneOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Existing Content */}
          <div>
            <label htmlFor="existingContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Existing Content
            </label>
            <textarea
              id="existingContent"
              name="existingContent"
              value={formData.existingContent}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Any existing content/branding that should be incorporated (or website URL)"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Any other information that might help create better content"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 text-white font-medium rounded-md ${
                isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              } transition duration-150 ease-in-out`}
            >
              {isSubmitting ? 'Generating...' : 'Generate Website Content'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}