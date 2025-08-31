'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const userInfoSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  countryOfResidence: z.string().min(1, 'Country of residence is required'),
  preferredLanguage: z.enum(['english', 'spanish', 'french'], {
    required_error: 'Please select a preferred language'
  }),
  wantTravelTips: z.boolean()
});

type UserInfoValues = z.infer<typeof userInfoSchema>;

// Progress stepper component
function ProgressStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Find', icon: '🔍' },
    { number: 2, label: 'Select your city', icon: '📍' },
    { number: 3, label: 'Set your budget', icon: '💰' },
    { number: 4, label: 'Personalize your trip', icon: '⭐' },
    { number: 5, label: 'View', icon: '👁️' },
    { number: 6, label: 'Manage', icon: '⚙️' }
  ];

  return (
    <div className="progress-stepper">
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.number} className="step-item">
            <div className={`step-circle ${step.number <= currentStep ? 'active' : ''}`}>
              <span className="step-icon">{step.icon}</span>
            </div>
            <span className="step-label">{step.label}</span>
            {index < steps.length - 1 && (
              <div className={`step-line ${step.number < currentStep ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Language radio button component
function LanguageOption({ 
  id, 
  value, 
  label, 
  selected, 
  onChange 
}: { 
  id: string; 
  value: string; 
  label: string; 
  selected: boolean; 
  onChange: (value: string) => void; 
}) {
  return (
    <label className="language-option" htmlFor={id}>
      <input
        type="radio"
        id={id}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="language-radio"
      />
      <span className="language-label">{label}</span>
    </label>
  );
}

export default function ParisSightseeingPage() {
  const [currentStep] = useState(4); // Personalize your trip step
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      preferredLanguage: 'english',
      wantTravelTips: true
    }
  });

  const watchedLanguage = watch('preferredLanguage');
  const watchedTravelTips = watch('wantTravelTips');

  const onSubmit = async (data: UserInfoValues) => {
    console.log('Form data:', data);
    // Here you would typically send the data to your API
    // and navigate to the next step
    alert('Form submitted successfully!');
  };

  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 32 }}>
      {/* Header with logo and navigation */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 32
      }}>
        <Link href="/" style={{ 
          fontWeight: 800, 
          fontSize: 24, 
          color: 'var(--td-dark)',
          textDecoration: 'none'
        }}>
          CityExplorer
        </Link>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/explore" style={{ color: 'var(--td-dark)', textDecoration: 'none' }}>
            🏛️ Explore
          </Link>
          <Link href="/register" style={{ color: 'var(--td-dark)', textDecoration: 'none' }}>
            Register
          </Link>
          <Link href="/login" style={{ color: 'var(--td-dark)', textDecoration: 'none' }}>
            Log in
          </Link>
        </nav>
      </header>

      {/* Progress stepper */}
      <ProgressStepper currentStep={currentStep} />

      {/* Main content */}
      <div className="page-content">
        <div className="content-header">
          <h1 className="page-title">Paris Sightseeing</h1>
          
          <div className="user-info-section">
            <h2 className="section-title">User Information</h2>
            <p className="section-subtitle">Please your details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="user-info-form">
          <div className="form-grid">
            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input
                id="contactNumber"
                type="tel"
                className="form-input"
                placeholder="+XX XX XX XX XX"
                {...register('contactNumber')}
              />
              {errors.contactNumber && (
                <span className="error-message">{errors.contactNumber.message}</span>
              )}
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="John Doe"
                {...register('fullName')}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName.message}</span>
              )}
            </div>

            {/* Birth Date */}
            <div className="form-group">
              <label htmlFor="birthDate" className="form-label">Birth Date</label>
              <div className="upgrade-plan-container">
                <input
                  id="birthDate"
                  type="date"
                  className="form-input"
                  {...register('birthDate')}
                />
                <button type="button" className="upgrade-plan-btn">
                  UPGRADE PLAN
                </button>
              </div>
              {errors.birthDate && (
                <span className="error-message">{errors.birthDate.message}</span>
              )}
            </div>

            {/* Country of Residence */}
            <div className="form-group">
              <label htmlFor="countryOfResidence" className="form-label">Country of Residence</label>
              <input
                id="countryOfResidence"
                type="text"
                className="form-input"
                placeholder="Country"
                {...register('countryOfResidence')}
              />
              {errors.countryOfResidence && (
                <span className="error-message">{errors.countryOfResidence.message}</span>
              )}
            </div>

            {/* Preferred Language */}
            <div className="form-group">
              <label className="form-label">Preferred Language</label>
              <div className="language-options">
                <LanguageOption
                  id="english"
                  value="english"
                  label="English"
                  selected={watchedLanguage === 'english'}
                  onChange={(value) => setValue('preferredLanguage', value as any)}
                />
                <LanguageOption
                  id="spanish"
                  value="spanish"
                  label="Spanish"
                  selected={watchedLanguage === 'spanish'}
                  onChange={(value) => setValue('preferredLanguage', value as any)}
                />
                <LanguageOption
                  id="french"
                  value="french"
                  label="French"
                  selected={watchedLanguage === 'french'}
                  onChange={(value) => setValue('preferredLanguage', value as any)}
                />
              </div>
              {errors.preferredLanguage && (
                <span className="error-message">{errors.preferredLanguage.message}</span>
              )}
            </div>
          </div>

          {/* Travel Tips Section */}
          <div className="travel-tips-section">
            <h3 className="tips-title">Do you want travel tips?</h3>
            <p className="tips-subtitle">Get personalized tips for your journey</p>
            
            <div className="tips-options">
              <label className="tips-option">
                <input
                  type="radio"
                  checked={watchedTravelTips === true}
                  onChange={() => setValue('wantTravelTips', true)}
                  className="tips-radio"
                />
                <span className="tips-label">Absolutely</span>
              </label>
              <label className="tips-option">
                <input
                  type="radio"
                  checked={watchedTravelTips === false}
                  onChange={() => setValue('wantTravelTips', false)}
                  className="tips-radio"
                />
                <span className="tips-label">No, thank you</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-blue submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .progress-stepper {
          margin-bottom: 48px;
        }

        .steps-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .step-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .step-circle.active {
          background: var(--td-blue);
          color: white;
        }

        .step-icon {
          font-size: 20px;
        }

        .step-label {
          font-size: 12px;
          color: #6B7280;
          text-align: center;
          max-width: 80px;
        }

        .step-line {
          width: 40px;
          height: 2px;
          background: #E5E7EB;
          position: absolute;
          top: 24px;
          left: calc(100% + 6px);
        }

        .step-line.completed {
          background: var(--td-blue);
        }

        .page-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .content-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--td-dark);
          margin: 0 0 32px 0;
        }

        .user-info-section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--td-dark);
          margin: 0 0 8px 0;
        }

        .section-subtitle {
          color: #6B7280;
          margin: 0;
        }

        .user-info-form {
          background: white;
          border-radius: var(--td-radius);
          box-shadow: var(--td-shadow);
          padding: 32px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 500;
          color: var(--td-dark);
          font-size: 14px;
        }

        .form-input {
          padding: 12px 16px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--td-blue);
          box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
        }

        .upgrade-plan-container {
          position: relative;
        }

        .upgrade-plan-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #FCD34D;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #92400E;
          cursor: pointer;
        }

        .language-options {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .language-radio {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #D1D5DB;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
        }

        .language-radio:checked {
          border-color: var(--td-blue);
        }

        .language-radio:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: var(--td-blue);
          border-radius: 50%;
        }

        .language-label {
          font-size: 14px;
          color: var(--td-dark);
        }

        .travel-tips-section {
          margin-bottom: 32px;
          padding-top: 24px;
          border-top: 1px solid #E5E7EB;
        }

        .tips-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--td-dark);
          margin: 0 0 8px 0;
        }

        .tips-subtitle {
          color: #6B7280;
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        .tips-options {
          display: flex;
          gap: 24px;
        }

        .tips-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .tips-radio {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #D1D5DB;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
        }

        .tips-radio:checked {
          border-color: var(--td-blue);
        }

        .tips-radio:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: var(--td-blue);
          border-radius: 50%;
        }

        .tips-label {
          font-size: 14px;
          color: var(--td-dark);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
        }

        .submit-btn {
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
        }

        .error-message {
          color: #DC2626;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .steps-container {
            gap: 8px;
          }

          .step-circle {
            width: 40px;
            height: 40px;
          }

          .step-icon {
            font-size: 16px;
          }

          .step-line {
            width: 30px;
            left: calc(100% + 4px);
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .user-info-form {
            padding: 24px;
          }

          .page-title {
            font-size: 24px;
          }

          .language-options,
          .tips-options {
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .steps-container {
            gap: 4px;
          }

          .step-circle {
            width: 32px;
            height: 32px;
          }

          .step-icon {
            font-size: 14px;
          }

          .step-label {
            font-size: 10px;
            max-width: 60px;
          }

          .step-line {
            width: 20px;
            left: calc(100% + 2px);
          }

          .user-info-form {
            padding: 16px;
          }
        }
      `}</style>
    </main>
  );
}
