import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CostPage from '../../pages/CostPage';
import api from '../../components/lib/axios';
import { BrowserRouter } from 'react-router-dom';

// Mock API
jest.mock('../../components/lib/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock AddCostModal
jest.mock('../../components/modals/AddCostModal', () => (props) => (
  <div data-testid="add-cost-modal">{props.open ? 'OPEN' : 'CLOSED'}</div>
));

// ⭐ NEW — Mock ReimbursementHistoryModal
jest.mock('../../components/modals/ReimbursementHistoryModal', () => (props) => (
  <div data-testid="history-modal">{props.open ? 'HISTORY OPEN' : 'HISTORY CLOSED'}</div>
));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <CostPage />
    </BrowserRouter>
  );

describe('CostPage — Expanded Coverage', () => {
  const mockVehicle = {
    id: 123,
    make: 'Toyota',
    model: 'Corolla',
    status: 'Active',
  };

  const mockCosts = [
    {
      id: 1,
      name: 'Tyres',
      category: 'Maintenance',
      paidByUserName: 'John',
      date: '2024-01-10',
      amount: 200,
      isReimbursed: false,
    },
    {
      id: 2,
      name: 'Oil Change',
      category: 'Maintenance',
      paidByUserName: 'Sarah',
      date: '2024-01-12',
      amount: 80,
      isReimbursed: true,
    },
    {
      id: 3,
      name: 'Fuel',
      category: 'Fuel',
      paidByUserName: 'John',
      date: '2024-01-15',
      amount: 50,
      isReimbursed: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    api.get.mockImplementation((url) => {
      if (url === '/Car/123') return Promise.resolve({ data: mockVehicle });
      if (url === '/Cost/vehicle/123')
        return Promise.resolve({ data: mockCosts });
      return Promise.resolve({ data: {} });
    });
  });

  test('shows loading state initially', () => {
    renderPage();
    expect(screen.getByText(/loading cost data/i)).toBeInTheDocument();
  });

  test('loads and displays vehicle info', async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByText('Toyota Corolla — Active')).toBeInTheDocument()
    );
  });

  test('displays total cost correctly', async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByText('Total Cost: £330')).toBeInTheDocument()
    );
  });

  test('renders partner chips', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('John: £250')).toBeInTheDocument();
      expect(screen.getByText('Sarah: £80')).toBeInTheDocument();
    });
  });

  test('filters costs when clicking a partner chip', async () => {
    renderPage();

    await waitFor(() => screen.getByText('John: £250'));

    fireEvent.click(screen.getByText('John: £250'));

    expect(screen.getByText('Tyres')).toBeInTheDocument();
    expect(screen.getAllByText('Fuel').length).toBeGreaterThan(0);
    expect(screen.queryByText('Oil Change')).not.toBeInTheDocument();
  });

  test('clicking "All" resets filter', async () => {
    renderPage();

    await waitFor(() => screen.getByText('John: £250'));

    fireEvent.click(screen.getByText('John: £250'));
    fireEvent.click(screen.getByText('All'));

    expect(screen.getByText('Oil Change')).toBeInTheDocument();
    expect(screen.getByText('Tyres')).toBeInTheDocument();
  });

  test('opens AddCostModal when clicking "+ Add Cost"', async () => {
    renderPage();

    await waitFor(() => screen.getByText('+ Add Cost'));

    fireEvent.click(screen.getByText('+ Add Cost'));

    expect(screen.getByTestId('add-cost-modal')).toHaveTextContent('OPEN');
  });

  test('renders cost table rows', async () => {
    renderPage();

    await waitFor(() => screen.getByText('Tyres'));

    expect(screen.getByText('Tyres')).toBeInTheDocument();
    expect(screen.getByText('Oil Change')).toBeInTheDocument();
    expect(screen.getAllByText('Fuel').length).toBeGreaterThan(0);
  });

  test('shows correct reimbursement buttons', async () => {
    renderPage();

    await waitFor(() => screen.getByText('Tyres'));

    // ⭐ UPDATED — "View" no longer exists, replaced by "Undo"
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getAllByText('Reimburse').length).toBe(2);
  });

  test('calls API endpoints correctly', async () => {
    renderPage();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/Car/123');
      expect(api.get).toHaveBeenCalledWith('/Cost/vehicle/123');
    });
  });

  test('AddCostModal receives correct props', async () => {
    renderPage();

    await waitFor(() => screen.getByText('+ Add Cost'));

    fireEvent.click(screen.getByText('+ Add Cost'));

    const modal = screen.getByTestId('add-cost-modal');
    expect(modal).toHaveTextContent('OPEN');
  });
});
