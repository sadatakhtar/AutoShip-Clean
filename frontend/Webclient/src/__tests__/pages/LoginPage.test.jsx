import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';
import api from '../../api/axios';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../api/axios', () => ({
  post: jest.fn(),
}));

// ✅ Mock navigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock alert()
global.alert = jest.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form correctly', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('updates username and password fields', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Pass123!' },
    });

    expect(screen.getByLabelText(/username/i).value).toBe('john');
    expect(screen.getByLabelText(/password/i).value).toBe('Pass123!');
  });

  test('successful login stores token and navigates to /home', async () => {
    api.post.mockResolvedValueOnce({
      data: { token: 'fake-jwt-token' },
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Pass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'john',
        password: 'Pass123!',
      });
    });

    expect(localStorage.getItem('jwtToken')).toBe('fake-jwt-token');
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('failed login shows error message and alert', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: 'Invalid credentials' },
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wrong' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid credentials');
    });

    expect(
      screen.getByText('Invalid username or password')
    ).toBeInTheDocument();
  });

  test("clicking 'Forgot Password?' navigates to /forgot-password", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText(/forgot password/i));

    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });

  test('failed login handles generic error without response.data', async () => {
    api.post.mockRejectedValueOnce(new Error('Network down'));

    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid credentials');
    });

    expect(
      screen.getByText('Invalid username or password')
    ).toBeInTheDocument();
  });
});
