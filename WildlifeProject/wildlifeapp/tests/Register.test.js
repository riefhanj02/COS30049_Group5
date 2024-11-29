import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../app/register/Register'; // Adjust the path as per your file structure
import axios from 'axios';

jest.mock('axios');

describe('Register Component', () => {
  test('renders registration form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    expect(getByPlaceholderText('First Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  test('registers successfully with valid inputs', async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { id: 1, first_name: 'Jane', last_name: 'Doe' },
    });

    const { getByPlaceholderText, getByText, queryByText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'Jane');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'jane.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => expect(queryByText('Registration successful!')).toBeTruthy());
  });

  test('shows error for missing fields', async () => {
    const { getByText, queryByText } = render(<Register />);

    fireEvent.press(getByText('Register'));

    await waitFor(() => expect(queryByText('All fields are required.')).toBeTruthy());
  });
});
