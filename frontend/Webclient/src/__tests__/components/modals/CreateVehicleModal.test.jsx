// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import CreateVehicleModal from '../../../components/modals/CreateVehicleModal';
// import api from '../../../api/axios';

// // Correct axios mock shape
// jest.mock('../../../api/axios', () => ({
//   __esModule: true,
//   default: {
//     post: jest.fn(),
//   },
// }));

// beforeAll(() => {
//   jest.useFakeTimers('modern');
// });

// const setup = (open = true, setOpen = jest.fn(), onSuccess = jest.fn()) => {
//   return render(<CreateVehicleModal open={open} setOpen={setOpen} onSuccess={onSuccess} />);
// };

// // FIXED helper for MUI Select
// const selectOption = (label, optionText) => {
//   fireEvent.mouseDown(screen.getByLabelText(label));
//   const options = screen.getAllByText(optionText);
//   fireEvent.click(options[options.length - 1]); // click the real menu item
// };

// describe('CreateVehicleModal', () => {
//   test('renders modal when open', () => {
//     setup(true);
//     expect(screen.getByText('Create New Vehicle')).toBeInTheDocument();
//   });

//   test('does not render when closed', () => {
//     setup(false);
//     expect(screen.queryByText('Create New Vehicle')).not.toBeInTheDocument();
//   });

//   test('updates form fields correctly', () => {
//     setup(true);

//     const vinInput = screen.getByLabelText('VIN');
//     fireEvent.change(vinInput, { target: { value: '12345' } });

//     expect(vinInput.value).toBe('12345');
//   });

//   test('submits form successfully and shows success message', async () => {
//     api.post.mockResolvedValueOnce({ data: { id: 1 } });

//     const setOpen = jest.fn();
//     setup(true, setOpen);

//     // Fill all required fields
//     fireEvent.change(screen.getByLabelText('VIN'), { target: { value: '12345' } });
//     fireEvent.change(screen.getByLabelText('Make'), { target: { value: 'Audi' } });
//     fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'E-tron' } });
//     fireEvent.change(screen.getByLabelText('Manufacture Date'), { target: { value: '2025-01-01' } });

//     // Select dropdowns using correct MUI pattern
//     selectOption('Status', 'Available');
//     selectOption('IVA Status', 'Pending');
//     selectOption('MOT Status', 'Pending');
//     selectOption('V55 Status', 'Pending');

//     fireEvent.click(screen.getByText('Create Vehicle'));

//     await waitFor(() =>
//       expect(screen.getByText('Vehicle created successfully')).toBeInTheDocument()
//     );

//     jest.advanceTimersByTime(1200);

//     expect(setOpen).toHaveBeenCalledWith(false);
//   });

//   test('shows error message when API fails', async () => {
//     api.post.mockRejectedValueOnce(
//       Object.assign(new Error('Request failed'), {
//         response: { data: 'Server error occurred' },
//       })
//     );

//     setup(true);

//     // Fill all required fields
//     fireEvent.change(screen.getByLabelText('VIN'), { target: { value: '12345' } });
//     fireEvent.change(screen.getByLabelText('Make'), { target: { value: 'Audi' } });
//     fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'E-tron' } });
//     fireEvent.change(screen.getByLabelText('Manufacture Date'), { target: { value: '2025-01-01' } });

//     // Select dropdowns using correct MUI pattern
//     selectOption('Status', 'Available');
//     selectOption('IVA Status', 'Pending');
//     selectOption('MOT Status', 'Pending');
//     selectOption('V55 Status', 'Pending');

//     fireEvent.click(screen.getByText('Create Vehicle'));

//     await waitFor(() =>
//       expect(screen.getByText('Server error occurred')).toBeInTheDocument()
//     );
//   });

//   test('closes modal when Cancel is clicked', () => {
//     const setOpen = jest.fn();
//     setup(true, setOpen);

//     fireEvent.click(screen.getByText('Cancel'));

//     expect(setOpen).toHaveBeenCalledWith(false);
//   });
// });

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import CreateVehicleModal from '../../../components/modals/CreateVehicleModal';
import api from '../../../api/axios';

jest.mock('../../../api/axios', () => {
  return {
    __esModule: true,
    default: {
      post: jest.fn(),
    },
  };
});

// Reset DOM + mocks after every test
afterEach(() => {
  document.body.innerHTML = ''; // ⭐ Clears MUI portal dialogs
  jest.clearAllMocks();
  cleanup();
});

const setup = (open = true, setOpen = jest.fn(), onSuccess = jest.fn()) => {
  return render(
    <CreateVehicleModal open={open} setOpen={setOpen} onSuccess={onSuccess} />
  );
};

// ⭐ Bulletproof MUI Select helper
const selectOption = (label, optionText) => {
  fireEvent.mouseDown(screen.getByLabelText(label));

  // Get ALL matching menu items by role
  const items = screen.getAllByRole('option', { name: optionText });

  // Click the LAST one — always the real menu item
  fireEvent.click(items[items.length - 1]);
};

describe('CreateVehicleModal', () => {
  test('renders modal when open', () => {
    setup(true);
    expect(screen.getByText('Create New Vehicle')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    setup(false);
    expect(screen.queryByText('Create New Vehicle')).not.toBeInTheDocument();
  });

  test('updates form fields correctly', () => {
    setup(true);

    const vinInput = screen.getByLabelText('VIN');
    fireEvent.change(vinInput, { target: { value: '12345' } });

    expect(vinInput.value).toBe('12345');
  });

  test('shows error message when API fails', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: 'Server error occurred' },
    });

    setup(true);

    // Fill required fields
    fireEvent.change(screen.getByLabelText('VIN'), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText('Make'), {
      target: { value: 'Audi' },
    });
    fireEvent.change(screen.getByLabelText('Model'), {
      target: { value: 'E-tron' },
    });
    fireEvent.change(screen.getByLabelText('Manufacture Date'), {
      target: { value: '2025-01-01' },
    });

    selectOption('Status', 'Available');
    selectOption('IVA Status', 'Pending');
    selectOption('MOT Status', 'Pending');
    selectOption('V55 Status', 'Pending');
    selectOption('Document Type', 'V5');

    fireEvent.click(screen.getByText('Create Vehicle'));

    await waitFor(() =>
      expect(screen.getByText(/server error occurred/i)).toBeInTheDocument()
    );
  });

  test('submits form successfully with one file', async () => {
    jest.useFakeTimers();
    api.post.mockResolvedValueOnce({ data: { id: 1 } });

    const setOpen = jest.fn();
    setup(true, setOpen);

    // Fill required fields
    fireEvent.change(screen.getByLabelText('VIN'), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText('Make'), {
      target: { value: 'Audi' },
    });
    fireEvent.change(screen.getByLabelText('Model'), {
      target: { value: 'E-tron' },
    });
    fireEvent.change(screen.getByLabelText('Manufacture Date'), {
      target: { value: '2025-01-01' },
    });

    selectOption('Status', 'Available');
    selectOption('IVA Status', 'Pending');
    selectOption('MOT Status', 'Pending');
    selectOption('V55 Status', 'Pending');
    selectOption('Document Type', 'V5');

    // Upload one file
    const file = new File(['file-content'], 'v5.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/upload documents/i);
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Create Vehicle'));

    await waitFor(() =>
      expect(
        screen.getByText('Vehicle created successfully')
      ).toBeInTheDocument()
    );

    // ⭐ Flush the timeout that closes the modal
    jest.runOnlyPendingTimers();

    expect(setOpen).toHaveBeenCalledWith(false);

    jest.useRealTimers(); // ⭐ restore timers

    // Validate FormData
    const formData = api.post.mock.calls[0][1];
    expect(formData.get('Documents')).toBe(file);
    expect(formData.get('DocumentType')).toBe('V5');
  });

  test('closes modal when Cancel is clicked', () => {
    const setOpen = jest.fn();
    setup(true, setOpen);

    fireEvent.click(screen.getByText('Cancel'));

    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
