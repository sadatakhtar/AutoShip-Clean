import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from '../../pages/SettingsPage';
import { BrowserRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = jest.fn();
let mockLocationState = null;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState }),
}));

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

const renderPage = () =>
  render(
    <BrowserRouter>
      <SettingsPage />
    </BrowserRouter>
  );

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationState = null; // reset to default
  });

  test('renders the Settings title', () => {
    renderPage();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('renders all four settings cards', () => {
    renderPage();

    expect(screen.getByText('Create New User')).toBeInTheDocument();
    expect(screen.getByText('Update User Role')).toBeInTheDocument();
    expect(screen.getByText('Delete User')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  test('renders descriptions for each card', () => {
    renderPage();

    expect(
      screen.getByText('Add a new user to the system.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Modify permissions or roles for existing users.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Remove a user from the system.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Update your account password.')
    ).toBeInTheDocument();
  });

  test('renders an Open button for each card', () => {
    renderPage();

    const openButtons = screen.getAllByText('Open');
    expect(openButtons.length).toBe(4);
  });

  test('clicking Back triggers navigation', () => {
    renderPage();

    fireEvent.click(screen.getByTestId('back-btn'));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('clicking Create New User navigates to /register', () => {
    renderPage();

    const createUserBtn = screen.getAllByText('Open')[0];
    fireEvent.click(createUserBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('clicking Delete User navigates to /manage-users', () => {
    renderPage();

    const deleteUserBtn = screen.getAllByText('Open')[2];
    fireEvent.click(deleteUserBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/manage-users');
  });

  test('shows snackbar when successMessage exists in location.state', () => {
    mockLocationState = { successMessage: 'User created successfully' };

    renderPage();

    expect(screen.getByTestId('snackbar')).toHaveTextContent(
      'User created successfully'
    );
  });

  test('does NOT show snackbar when no successMessage exists', () => {
    mockLocationState = null; // explicitly ensure no state

    renderPage();

    expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
  });
});
