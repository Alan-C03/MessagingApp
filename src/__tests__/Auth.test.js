import { signInWithGoogle, signOut } from '../services/auth'; // Adjust the import path as necessary
import { auth } from './firebase'; // Adjust the import path as necessary
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
}));

describe('Authentication Functions', () => {
    describe('signInWithGoogle', () => {
        it('should call signInWithPopup with the correct parameters on success', async () => {
            const mockUser = { uid: '12345', displayName: 'Test User' };
            signInWithPopup.mockResolvedValueOnce({ user: mockUser });

            await expect(signInWithGoogle()).resolves.toEqual({ user: mockUser });
            expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
        });

        it('should handle errors on signInWithPopup failure', async () => {
            const errorMessage = 'Sign-in failed';
            signInWithPopup.mockRejectedValueOnce(new Error(errorMessage));

            await expect(signInWithGoogle()).rejects.toThrow(errorMessage);
            expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
        });
    });

    describe('signOut', () => {
        it('should call firebaseSignOut successfully', async () => {
            firebaseSignOut.mockResolvedValueOnce();

            await expect(signOut()).resolves.toBeUndefined();
            expect(firebaseSignOut).toHaveBeenCalledWith(auth);
        });

        it('should handle errors on signOut failure', async () => {
            const errorMessage = 'Sign-out failed';
            firebaseSignOut.mockRejectedValueOnce(new Error(errorMessage));

            await expect(signOut()).rejects.toThrow(errorMessage);
            expect(firebaseSignOut).toHaveBeenCalledWith(auth);
        });
    });
});