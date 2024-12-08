import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatRoom from '../Components/ChatRoom';
import { db } from '../services/firebase';
import { ref, set } from 'firebase/database';

// Mock Firebase
jest.mock('../services/firebase', () => {
    return {
        db: jest.fn(),
        ref: jest.fn(),
        push: jest.fn(),
        onValue: jest.fn(),
    };
});

const mockUser = { displayName: 'Test User' };

describe('ChatRoom Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders ChatRoom component', () => {
        render(<ChatRoom user={mockUser} />);
        expect(screen.getByText(/Chat Room/i)).toBeInTheDocument();
    });

    test('displays messages from Firebase', () => {
        const messages = [
            { text: 'Hello!', sender: 'User1', timestamp: '2023-01-01T00:00:00Z' },
            { text: 'Hi there!', sender: 'User2', timestamp: '2023-01-01T00:01:00Z' },
        ];

        const messagesRef = ref(db, "messages");
        // Mocking onValue to simulate Firebase data
        jest.spyOn(require('firebase/database'), 'onValue').mockImplementation((ref, callback) => {
            callback({ val: () => messages });
            return jest.fn(); // return unsubscribe function
        });

        render(<ChatRoom user={mockUser} />);

        messages.forEach(msg => {
            expect(screen.getByText(msg.text)).toBeInTheDocument();
        });
    });

    test('sends a message successfully', async () => {
        const messagesRef = ref(db, "messages");
        const mockPush = jest.spyOn(require('firebase/database'), 'push').mockResolvedValueOnce();

        render(<ChatRoom user={mockUser} />);

        fireEvent.change(screen.getByPlaceholderText(/Type a message.../i), { target: { value: 'New Message' } });
        fireEvent.click(screen.getByText(/Send/i));

        expect(mockPush).toHaveBeenCalledWith(messagesRef, {
            text: 'New Message',
            sender: mockUser.displayName,
            timestamp: expect.any(String), // check that timestamp is a string
        });
        expect(screen.getByPlaceholderText(/Type a message.../i).value).toBe('');
    });

    test('handles sending message failure', async () => {
        const messagesRef = ref(db, "messages");
        const mockPush = jest.spyOn(require('firebase/database'), 'push').mockRejectedValueOnce(new Error('Failed to send message'));

        render(<ChatRoom user={mockUser} />);

        fireEvent.change(screen.getByPlaceholderText(/Type a message.../i), { target: { value: 'Another Message' } });
        fireEvent.click(screen.getByText(/Send/i));

        expect(mockPush).toHaveBeenCalled();
        // Optionally check for an error message in the UI if you implement error handling in your component
    });

    test('does not send empty messages', () => {
        render(<ChatRoom user={mockUser} />);
        fireEvent.click(screen.getByText(/Send/i));

        // You can check if push was not called or if an alert is shown, depending on your implementation
        expect(push).not.toHaveBeenCalled();
    });
});