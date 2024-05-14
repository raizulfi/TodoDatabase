import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { updateProfile } from 'firebase/auth'; // Import the function to update user profile

const Home = () => {
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch user data when component mounts
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
        }
    }, [currentUser]);

    const handleSave = async () => {
        try {
            await updateProfile(currentUser, { displayName: newDisplayName }); // Update user profile in Firebase
            setDisplayName(newDisplayName);
            setIsEditing(false);
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    return (
        <div className='text-2xl font-bold pt-14'>
            {isEditing ? (
                <>
                    <input
                        type='text'
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        placeholder='Enter your new name'
                    />
                    <button onClick={handleSave}>Save</button>
                </>
            ) : (
                <>
                    <p>Hello {displayName || currentUser.email}, you are now logged in.</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </>
            )}
            {error && <div>{error}</div>}
        </div>
    );
};

export default Home;
