// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { auth } from '../services/firebase';
import App from './App'; // Adjust this path if necessary
import Login from './components/Login'; // Adjust this path if necessary
import UserProfile from './components/UserProfile'; // Adjust this path if necessary
import ChatRoom from './components/ChatRoom'; // Adjust this path if necessary

// Mock the auth.onAuthStateChanged function
jest.mock('../services/firebase', () => ({
    auth: {
        onAuthStateChanged: jest.fn(),
    },
}));

jest.mock('../components/Login', () => () => <div>Login Component</div>);
jest.mock('../components/UserProfile', () => () => <div>UserProfile Component</div>);
jest.mock('../components/ChatRoom', () => () => <div>ChatRoom Component</div>);

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Login component when there is no user', () => {
        auth.onAuthStateChanged.mockImplementation((callback) => callback(null));
        render(<App />);
        expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
        expect(screen.queryByText(/UserProfile Component/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/ChatRoom Component/i)).not.toBeInTheDocument();
    });

    test('renders UserProfile and ChatRoom when there is a user', () => {
        const mockUser = { uid: '123', displayName: 'Test User' };
        auth.onAuthStateChanged.mockImplementation((callback) => callback(mockUser));
        render(<App />);

        expect(screen.getByText(/UserProfile Component/i)).toBeInTheDocument();
        expect(screen.getByText(/ChatRoom Component/i)).toBeInTheDocument();
        expect(screen.queryByText(/Login Component/i)).not.toBeInTheDocument();
    });

    test('handles user state change correctly', () => {
        const mockUser = { uid: '123', displayName: 'Test User' };

        // Simulate user login
        auth.onAuthStateChanged.mockImplementation((callback) => {
            callback(mockUser);
            return jest.fn(); // return a cleanup function
        });

        const { rerender } = render(<App />);
        expect(screen.getByText(/UserProfile Component/i)).toBeInTheDocument();

        // Simulate user logout
        auth.onAuthStateChanged.mockImplementation((callback) => {
            callback(null);
        });

        rerender(<App />);
        expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
        expect(screen.queryByText(/UserProfile Component/i)).not.toBeInTheDocument();
    });

    test('renders correctly under different conditions', () => {
        // Test with no user
        auth.onAuthStateChanged.mockImplementation((callback) => callback(null));
        const { container: container1 } = render(<App />);
        expect(container1).toMatchSnapshot();

        // Test with a user
        const mockUser = { uid: '123', displayName: 'Test User' };
        auth.onAuthStateChanged.mockImplementation((callback) => callback(mockUser));
        const { container: container2 } = render(<App />);
        expect(container2).toMatchSnapshot();
    });
});