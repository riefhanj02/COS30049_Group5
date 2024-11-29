import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../app/profile/Profile'; // Adjust the path as per your file structure
import axios from 'axios';

jest.mock('axios');

describe('Profile Component', () => {
  test('renders login screen when not logged in', () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  test('logs in successfully and renders profile', async () => {
    const mockUserData = {
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe',
      gender: 'Female',
      birthday: '1995-03-25',
      email: 'jane.doe@example.com',
    };

    axios.post.mockResolvedValueOnce({ status: 200, data: { user: mockUserData } });

    const { getByPlaceholderText, getByText, queryByText } = render(<Profile />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'jane.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => expect(queryByText('Jane Doe')).toBeTruthy());

    expect(queryByText('Jane Doe')).toBeTruthy();
    expect(queryByText('Female')).toBeTruthy();
  });

  test('shows error for incorrect login', async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 401, data: { error: 'Invalid email or password' } },
    });

    const { getByPlaceholderText, getByText, queryByText } = render(<Profile />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong.email@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => expect(queryByText('Failed to log in. Please try again.')).toBeTruthy());
  });
});
