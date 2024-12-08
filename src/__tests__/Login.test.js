// Login.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import { signInWithGoogle } from '../services/auth';

// Mock the signInWithGoogle function
jest.mock('../services/auth', () => ({
    signInWithGoogle: jest.fn(),
}));

describe('Login Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the login button', () => {
        const { getByText } = render(<Login />);
        const buttonElement = getByText(/Sign in with Google/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls signInWithGoogle when button is clicked', () => {
        const { getByText } = render(<Login />);
        const buttonElement = getByText(/Sign in with Google/i);

        fireEvent.click(buttonElement);

        expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    });

    test('does not call signInWithGoogle when button is not clicked', () => {
        render(<Login />);

        expect(signInWithGoogle).not.toHaveBeenCalled();
    });
});