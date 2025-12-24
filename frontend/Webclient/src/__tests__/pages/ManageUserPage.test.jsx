import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import ManageUsersPage from '../../pages/ManageUsersPage';
import { BrowserRouter } from 'react-router-dom';

// Mock API
jest.mock('../../api/axios', () => ({
  get: jest.fn(),
  delete: jest.fn(),
}));

import api from '../../api/axios';

// Mock DashboardTitleAndModal
jest.mock('../../components/DashboardTitleAndModal', () => (props) => (
  <div data-testid="dashboard-title">
    <h1>{props.title}</h1>
    <button data-testid="back-btn" onClick={props.handleBack}>
      Back
    </button>
  </div>
));

// Mock SuccessSnackbar
jest.mock(
  '../../components/SuccessSnackbar',
  () => (props) =>
    props.open ? <div data-testid="snackbar">{props.message}</div> : null
);

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@test.com', role: 'Admin' },
  { id: 2, username: 'john', email: 'john@test.com', role: 'User' },
];

const renderPage = () =>
  render(
    <BrowserRouter>
      <ManageUsersPage />
    </BrowserRouter>
  );

describe('ManageUsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockUsers });
  });

  test('renders page title', async () => {
    renderPage();
    expect(await screen.findByText('Manage Users')).toBeInTheDocument();
  });

  test('fetches and displays users in table', async () => {
    renderPage();

    expect(await screen.findByText('admin')).toBeInTheDocument();
    expect(screen.getByText('john')).toBeInTheDocument();
  });

  test('renders table headers', async () => {
    renderPage();

    expect(await screen.findByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('opens delete confirmation dialog when clicking delete', async () => {
    renderPage();

    const deleteButtons = await screen.findAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Delete User')).toBeInTheDocument();

    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByText((content) =>
        content.includes('Are you sure you want to delete user with ID')
      )
    ).toBeInTheDocument();
  });

  test('deletes user and shows snackbar', async () => {
    api.delete.mockResolvedValue({});

    renderPage();

    // Click delete on first user
    const deleteButtons = await screen.findAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Confirm delete
    const dialog = screen.getByRole('dialog');
    const confirmDeleteBtn = within(dialog).getByRole('button', {
      name: 'Delete',
    });
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/user/1');
    });

    // User removed from table
    await waitFor(() => {
      expect(screen.queryByText('admin')).not.toBeInTheDocument();
    });

    // Snackbar appears
    expect(screen.getByTestId('snackbar')).toHaveTextContent(
      'User deleted successfully'
    );
  });

  test('back button triggers navigation', async () => {
    renderPage();

    fireEvent.click(screen.getByTestId('back-btn'));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
