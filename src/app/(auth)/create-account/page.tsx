// src/app/(auth)/create-account/page.tsx
'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import AuthCard from '../../components/AuthCard';
import PasswordInput from '../../components/PasswordInput';
import {API_BASE} from '../../lib/env';
import {registerSchema, RegisterValues} from '../../lib/schema';

export default function CreateAccountPage() {
    const {register, handleSubmit, formState: {errors, isSubmitting}} =
        useForm<RegisterValues>({resolver: zodResolver(registerSchema)});
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (values: RegisterValues) => {
        setServerError(null);
        try {
            const r = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                // backend expects: { email, password, displayName }
                body: JSON.stringify({
                    email: values.email, password: values.password, displayName: values.displayName
                }),
            });
            const data = await r.json();
            if (!r.ok || !data?.token) {
                throw new Error(data?.error?.message || 'Could not create account');
            }
            localStorage.setItem('travdy_token', data.token);
            router.replace('/'); // or /welcome
        } catch (e: any) {
            setServerError(e.message ?? 'Sign up failed');
        }
    };

    return (
        <AuthCard title="Create your Travdy Account">
            {serverError && (
                <div role="alert" className="card" style={{
                    background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5',
                    margin: '0 12px 12px', padding: '8px 12px'
                }}>
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{padding: '0 12px 12px'}}>
                <label htmlFor="displayName"><small>Name</small></label>
                <input id="displayName" className="input" placeholder="Your name" {...register('displayName')} />
                {errors.displayName && <small style={{color: '#B91C1C'}}>{errors.displayName.message}</small>}

                <div style={{height: 10}}/>

                <label htmlFor="email"><small>Email</small></label>
                <input id="email" className="input" placeholder="you@example.com" {...register('email')} />
                {errors.email && <small style={{color: '#B91C1C'}}>{errors.email.message}</small>}

                <div style={{height: 10}}/>

                <label htmlFor="password"><small>Password</small></label>
                <PasswordInput id="password" placeholder="Create a password" {...register('password')} />
                {errors.password && <small style={{color: '#B91C1C'}}>{errors.password.message}</small>}

                <div style={{height: 10}}/>

                <label htmlFor="confirm"><small>Confirm Password</small></label>
                <PasswordInput id="confirm" placeholder="Confirm password" {...register('confirm')} />
                {errors.confirm && <small style={{color: '#B91C1C'}}>{errors.confirm.message}</small>}

                <div style={{height: 10}}/>

                <button className="btn btn-green" disabled={isSubmitting} style={{width: '100%'}}>
                    {isSubmitting ? 'Creating…' : 'Create Account'}
                </button>

                <div style={{textAlign: 'center', marginTop: 12}}>
                    <Link href="/login"><small>Have an account? Log in</small></Link>
                </div>
            </form>
        </AuthCard>
    );
}
