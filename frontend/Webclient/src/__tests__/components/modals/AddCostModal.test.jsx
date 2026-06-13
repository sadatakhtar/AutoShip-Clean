import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AddCostModal from '../../../components/modals/AddCostModal';
import api from '../../../components/lib/axios';

// Mock axios
jest.mock('../../../components/lib/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// ⭐ FIXED: Proper Modal mock that forwards `open` so useEffect runs
jest.mock('@mui/material/Modal', () => {
  return ({ open, children, ...rest }) =>
    open ? (
      <div data-testid="mui-modal" {...rest}>
        {children}
      </div>
    ) : null;
});

describe('AddCostModal', () => {
  const mockUsers = [
    { id: 1, username: 'John' },
    { id: 2, username: 'Sarah' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockUsers });
  });

  const renderModal = (props = {}) =>
    render(
      <AddCostModal
        open={true}
        onClose={jest.fn()}
        vehicleId={123}
        onAdded={jest.fn()}
        {...props}
      />
    );

  test('renders modal fields', () => {
    renderModal();

    expect(screen.getAllByText('Add Cost').length).toBeGreaterThan(0);

    expect(screen.getByRole('textbox', { name: /cost name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /amount/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();

    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /paid by/i })).toBeInTheDocument();
  });


  test('shows alert if amount is missing', () => {
    window.alert = jest.fn();

    renderModal();

    const addButton = screen.getByRole('button', { name: /^add cost$/i });
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith('Amount is required');
  });

  test('handles API error gracefully', async () => {
    console.error = jest.fn();
    api.post.mockRejectedValue(new Error('Failed'));

    renderModal();

    fireEvent.change(screen.getByRole('spinbutton', { name: /amount/i }), {
      target: { value: '100' },
    });

    const addButton = screen.getByRole('button', { name: /^add cost$/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  test('calls onClose when Cancel is clicked', () => {
    const onClose = jest.fn();

    renderModal({ onClose });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });
});
