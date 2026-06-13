import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadDocumentsModal from '../../../components/modals/UploadDocumentsModal';
import api from '../../../components/lib/axios';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
jest.mock('../../../components/lib/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

// Mock react-router navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock MUI Dialog so children mount immediately
jest.mock('@mui/material/Dialog', () => (props) => (
  <div data-testid="mui-dialog">{props.children}</div>
));

beforeEach(() => {
  jest.clearAllMocks();
});

const renderModal = (props = {}) =>
  render(
    <BrowserRouter>
      <UploadDocumentsModal
        open={true}
        onClose={jest.fn()}
        carId={123}
        onUploaded={jest.fn()}
        {...props}
      />
    </BrowserRouter>
  );

describe('UploadDocumentsModal (stable tests only)', () => {
  test('renders modal and fields', () => {
    renderModal();

    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    expect(screen.getByLabelText('Document Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Received Date')).toBeInTheDocument();
    expect(screen.getByText('Choose files')).toBeInTheDocument();
  });

  test('shows error if trying to upload without selecting type', async () => {
    renderModal();

    fireEvent.click(screen.getByText('Upload'));

    expect(
      await screen.findByText('Please select a document type.')
    ).toBeInTheDocument();
  });

  test('shows error if trying to upload without files', async () => {
    renderModal();

    fireEvent.mouseDown(screen.getByLabelText('Document Type'));
    fireEvent.click(screen.getByText('V5'));

    fireEvent.click(screen.getByText('Upload'));

    expect(
      await screen.findByText('Please select at least one file.')
    ).toBeInTheDocument();
  });

  test('handles upload error', async () => {
    api.post.mockRejectedValue({
      response: { data: { message: 'Upload failed' } },
    });

    renderModal();

    fireEvent.mouseDown(screen.getByLabelText('Document Type'));
    fireEvent.click(screen.getByText('V5'));

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText('Upload'));

    expect(
      await screen.findByText('Error uploading documents')
    ).toBeInTheDocument();
  });
});
