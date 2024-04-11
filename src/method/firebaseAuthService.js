import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export const sendPasswordReset = async (email) => {
  if (typeof email !== 'string' || email.trim() === '') {
    console.error('Invalid email address:', email);
    alert('The email address is invalid.');
    return false;
  }

  const auth = getAuth();
  try {
    console.log('Attempting to send password reset email to:', email); // For debugging
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent!');
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    alert('There was a problem sending the password reset email.');
    return false;
  }
};
