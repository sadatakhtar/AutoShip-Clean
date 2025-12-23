import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DashboardPage from '../../pages/DashboardPage';
import api from '../../api/axios';
import { BrowserRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock API
jest.mock('../../api/axios', () => ({
  get: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

// Mock child components to isolate DashboardPage logic
jest.mock('../../components/CarTable', () => (props) => (
  <div
    data-testid="car-table"
    data-open={props.open ? 'true' : 'false'}
    data-error={props.error || ''}
    data-loading={props.loading ? 'true' : 'false'}
  >
    <button data-testid="delete-btn" onClick={() => props.onDelete(5)}>
      Delete Car
    </button>

    {/* NEW: simulate modal close */}
    <button data-testid="close-modal" onClick={props.handleClose}>
      Close Modal
    </button>

    <div data-testid="car-data">{JSON.stringify(props.data)}</div>
  </div>
));

jest.mock('../../components/DashboardTitleAndModal', () => (props) => (
  <div data-testid="dashboard-title">
    <button data-testid="open-modal" onClick={props.handleOpen}>
      Open Modal
    </button>
    <button data-testid="back-btn" onClick={props.handleBack}>
      Back
    </button>
  </div>
));

const renderPage = () =>
  render(
    <BrowserRouter>
      <DashboardPage />
    </BrowserRouter>
  );

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard component', () => {
    api.get.mockResolvedValue({ data: [] });
    renderPage();
    expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
  });

  test('fetches and displays car data', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 1, make: 'Toyota' }],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('car-data')).toHaveTextContent('Toyota');
    });
  });

  test('handles fetch error', async () => {
    api.get.mockRejectedValue(new Error('Fetch failed'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('car-data')).toHaveTextContent([]);
    });
  });

  test('navigates back when back button clicked', async () => {
    api.get.mockResolvedValue({ data: [] });

    renderPage();

    fireEvent.click(screen.getByTestId('back-btn'));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('successful delete removes car from state', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 5, make: 'BMW' }],
    });

    api.delete.mockResolvedValue({ status: 204 });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('car-data')).toHaveTextContent('BMW');
    });

    fireEvent.click(screen.getByTestId('delete-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('car-data')).toHaveTextContent('[]');
    });
  });

  test('delete fails with 403 (non-admin)', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 5, make: 'BMW' }],
    });

    api.delete.mockRejectedValue({
      response: { status: 403 },
    });

    window.alert = jest.fn();

    renderPage();

    fireEvent.click(screen.getByTestId('delete-btn'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Delete failed: only admin users can perform this task.'
      );
    });
  });

  test('delete fails with network error', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 5, make: 'BMW' }],
    });

    api.delete.mockRejectedValue({}); // no response → network error

    window.alert = jest.fn();

    renderPage();

    fireEvent.click(screen.getByTestId('delete-btn'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Delete failed due to a network or client error.'
      );
    });
  });

  // NEW TEST — modal opens when clicking "Open Modal"
  test('opens modal when open-modal button clicked', async () => {
    api.get.mockResolvedValue({ data: [] });

    renderPage();

    // Modal should be closed initially
    expect(screen.getByTestId('car-table')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-modal'));

    // CarTable receives open=true
    await waitFor(() => {
      expect(screen.getByTestId('car-table')).toHaveAttribute(
        'data-open',
        'true'
      );
    });
  });

  // NEW TEST — modal closes when handleClose is triggered
  test('closes modal when handleClose is called', async () => {
    api.get.mockResolvedValue({ data: [] });

    renderPage();

    // Open modal
    fireEvent.click(screen.getByTestId('open-modal'));

    await waitFor(() => {
      expect(screen.getByTestId('car-table')).toHaveAttribute(
        'data-open',
        'true'
      );
    });

    // Close modal via mock CarTable
    fireEvent.click(screen.getByTestId('close-modal'));

    await waitFor(() => {
      expect(screen.getByTestId('car-table')).toHaveAttribute(
        'data-open',
        'false'
      );
    });
  });

  // NEW TEST — delete fails with 401 (not logged in)
  test('delete fails with 401 (not logged in)', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 5, make: 'BMW' }],
    });

    api.delete.mockRejectedValue({
      response: { status: 401 },
    });

    window.alert = jest.fn();

    renderPage();

    fireEvent.click(screen.getByTestId('delete-btn'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Delete failed: you must be logged in.'
      );
    });
  });

  // NEW TEST — delete fails with 404 (vehicle not found)
  test('delete fails with 404 (vehicle not found)', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 5, make: 'BMW' }],
    });

    api.delete.mockRejectedValue({
      response: { status: 404 },
    });

    window.alert = jest.fn();

    renderPage();

    fireEvent.click(screen.getByTestId('delete-btn'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Delete failed: vehicle not found.'
      );
    });
  });

  // NEW TEST — delete fails with unexpected server error
  test('delete fails with unexpected server error', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 5, make: 'BMW' }],
    });

    api.delete.mockRejectedValue({
      response: { status: 500 },
    });

    window.alert = jest.fn();

    renderPage();

    fireEvent.click(screen.getByTestId('delete-btn'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Delete failed due to an unexpected server error.'
      );
    });
  });

  // NEW TEST — loading state is passed to CarTable
  test('sets loading state during fetch', async () => {
    let resolveGet;
    api.get.mockReturnValue(
      new Promise((resolve) => {
        resolveGet = resolve;
      })
    );

    renderPage();

    // While unresolved, loading should be true
    expect(screen.getByTestId('car-table')).toHaveAttribute(
      'data-loading',
      'true'
    );

    resolveGet({ data: [] });

    await waitFor(() => {
      expect(screen.getByTestId('car-table')).toHaveAttribute(
        'data-loading',
        'false'
      );
    });
  });

  // NEW TEST — error state is passed to CarTable
  test('passes error state to CarTable when fetch fails', async () => {
    api.get.mockRejectedValue(new Error('Fetch failed'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('car-table')).toHaveAttribute(
        'data-error',
        'Error fetching Data...'
      );
    });
  });
});
