import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from '../Components/UserProfile';
import { signOut } from '../services/auth';

jest.mock('../services/auth'); // Mock the signOut function

describe('UserProfile Component', () => {
    const user = {
        photoURL: 'https://example.com/photo.jpg',
        displayName: 'John Doe',
    };

    test('renders user profile with correct information', () => {
        render(<UserProfile user={user} />);

        const avatar = screen.getByAltText('avatar');
        expect(avatar).toHaveAttribute('src', user.photoURL);
        expect(screen.getByText(user.displayName)).toBeInTheDocument();
    });

    test('calls signOut function when Sign Out button is clicked', () => {
        render(<UserProfile user={user} />);

        const button = screen.getByText('Sign Out');
        fireEvent.click(button);

        expect(signOut).toHaveBeenCalled();
    });

    test('does not render user profile if user object is missing', () => {
        render(<UserProfile user={null} />);

        const avatar = screen.queryByAltText('avatar');
        const displayName = screen.queryByText(/John Doe/i);

        expect(avatar).not.toBeInTheDocument();
        expect(displayName).not.toBeInTheDocument();
    });

    test('renders default image if photoURL is missing', () => {
        const userWithoutPhoto = {
            ...user,
            photoURL: '',
        };

        render(<UserProfile user={userWithoutPhoto} />);

        const avatar = screen.getByAltText('avatar');
        expect(avatar).toHaveAttribute('src', ''); // Assuming you handle default in the component
    });

    test('renders placeholder if displayName is missing', () => {
        const userWithoutDisplayName = {
            ...user,
            displayName: '',
        };

        render(<UserProfile user={userWithoutDisplayName} />);

        expect(screen.getByText(/User Profile/i)).toBeInTheDocument(); // Assuming you have a placeholder text
    });
});