import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessSnackbar from '../../components/SuccessSnackbar';

describe('SuccessSnackbar', () => {
  test('renders message when open', () => {
    render(
      <SuccessSnackbar
        open={true}
        message="User created successfully"
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText('User created successfully')).toBeInTheDocument();
  });

  test('does not render when open = false', () => {
    render(
      <SuccessSnackbar
        open={false}
        message="Should not appear"
        onClose={jest.fn()}
      />
    );

    // Snackbar is not visible
    expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
  });

  test('calls onClose when snackbar closes', () => {
    const handleClose = jest.fn();

    render(
      <SuccessSnackbar
        open={true}
        message="Closing test"
        onClose={handleClose}
      />
    );

    // Find the close button inside the Alert
    const closeButton = screen.getByRole('button', { name: /close/i });

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  test('renders Alert with success severity', () => {
    render(
      <SuccessSnackbar
        open={true}
        message="Success message"
        onClose={jest.fn()}
      />
    );

    const alert = screen.getByRole('alert');

    expect(alert).toHaveClass('MuiAlert-filledSuccess');
    expect(alert).toHaveTextContent('Success message');
  });
});
