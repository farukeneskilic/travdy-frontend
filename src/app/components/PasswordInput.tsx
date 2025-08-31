// src/components/PasswordInput.tsx
'use client';
import React, {useState} from 'react';

export default function PasswordInput(
    props: React.InputHTMLAttributes<HTMLInputElement>
) {
    const [show, setShow] = useState(false);
    return (
        <div style={{position: 'relative'}}>
            <input {...props} type={show ? 'text' : 'password'} className="input"/>
            <button
                type="button"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={() => setShow(s => !s)}
                style={{
                    position: 'absolute', right: 8, top: 8, border: 'none',
                    background: 'transparent', cursor: 'pointer', padding: 6
                }}
            >
                {show ? '🙈' : '👁️'}
            </button>
        </div>
    );
}
