// src/app/(auth)/login/page.tsx
'use client';

import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import AuthCard from '../../components/AuthCard';
import PasswordInput from '../../components/PasswordInput';
import {API_BASE} from '../../lib/env';
import {loginSchema, LoginValues} from '../../lib/schema';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
    const {register, handleSubmit, formState: {errors, isSubmitting}} =
        useForm<LoginValues>({
            resolver: zodResolver(loginSchema), defaultValues: {
                email: '', password: '', remember: false
            }
        });
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (values: LoginValues) => {
        setServerError(null);
        try {
            const r = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: values.email, password: values.password, remember: values.remember }),
            });
            const data = await r.json();
            if (!r.ok || !data?.token) {
                throw new Error(data?.error?.message || 'Invalid credentials');
            }
            // Store JWT (for demo; consider httpOnly cookies via app proxy in prod)
            localStorage.setItem('travdy_token', data.token);
            router.replace('/'); // go home or dashboard
        } catch (e: unknown) {
            setServerError(e instanceof Error ? e.message : 'Login failed');
        }
    };

    return (
        <AuthCard title="Travdy Login">
            {serverError && (
                <div role="alert" className="card" style={{
                    background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5',
                    margin: '0 12px 12px', padding: '8px 12px'
                }}>
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{padding: '0 12px 12px'}}>
                <label htmlFor="email"><small>Email</small></label>
                <input id="email" placeholder="Enter your email" className="input" {...register('email')} />
                {errors.email && <small style={{color: '#B91C1C'}}>{errors.email.message}</small>}

                <div style={{height: 10}}/>

                <label htmlFor="password"><small>Password</small></label>
                <PasswordInput id="password" placeholder="Enter your password" {...register('password')} />
                {errors.password && <small style={{color: '#B91C1C'}}>{errors.password.message}</small>}

                <div style={{display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0'}}>
                    <input id="remember" type="checkbox" {...register('remember')} />
                    <label htmlFor="remember"><small>Remember Me</small></label>
                </div>

                <button className="btn btn-blue" disabled={isSubmitting} style={{width: '100%'}}>
                    {isSubmitting ? 'Signing in…' : 'Login'}
                </button>

                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
                    <Link href="/forgot-password"><small>Forgot Password?</small></Link>
                    <Link href="/create-account"><small>Create Account</small></Link>
                </div>
            </form>
        </AuthCard>
    );
}
