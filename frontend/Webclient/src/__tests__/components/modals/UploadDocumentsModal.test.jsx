import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadDocumentsModal from '../../../components/modals/UploadDocumentsModal';
import api from '../../../api/axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../../api/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

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

describe('UploadDocumentsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal and fields', () => {
    renderModal();

    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    expect(screen.getByLabelText('Document Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Received Date')).toBeInTheDocument();
    expect(screen.getByText('Choose files')).toBeInTheDocument();
  });

  test('fetches existing documents on open', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/document/car/123') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              fileName: 'doc1.pdf',
              type: 'V5',
              receivedDate: new Date(),
            },
          ],
        });
      }
      return Promise.resolve({ data: {} });
    });

    renderModal();

    expect(api.get).toHaveBeenCalledWith(
      '/document/car/123',
      expect.anything()
    );

    await waitFor(() => {
      expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    });
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

  test('uploads files successfully', async () => {
    api.post.mockResolvedValue({});
    const onUploaded = jest.fn();

    renderModal({ onUploaded });

    fireEvent.mouseDown(screen.getByLabelText('Document Type'));
    fireEvent.click(screen.getByText('V5'));

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByText('Upload'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(onUploaded).toHaveBeenCalled();
    });

    expect(
      screen.getByText('Documents uploaded successfully.')
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

    expect(await screen.findByText('Upload failed')).toBeInTheDocument();
  });

  test('opens delete confirmation dialog', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/document/car/123') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              fileName: 'doc1.pdf',
              type: 'V5',
              receivedDate: new Date(),
            },
          ],
        });
      }
      return Promise.resolve({ data: {} });
    });

    renderModal();

    await waitFor(() => {
      expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('DeleteIcon').closest('button'));

    expect(screen.getByText('Delete Document?')).toBeInTheDocument();
  });

  test('deletes a document', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/document/car/123') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              fileName: 'doc1.pdf',
              type: 'V5',
              receivedDate: new Date(),
            },
          ],
        });
      }
      return Promise.resolve({ data: {} });
    });

    api.delete.mockResolvedValueOnce({});

    renderModal();

    await waitFor(() => {
      expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('DeleteIcon').closest('button'));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(
        '/document/123/1',
        expect.anything()
      );
    });
  });

  test('downloads a document', async () => {
    // Stable mock: return based on URL
    api.get.mockImplementation((url) => {
      if (url === '/document/car/123') {
        return Promise.resolve({
          data: [
            {
              id: 1,
              fileName: 'doc1.pdf',
              type: 'V5',
              receivedDate: new Date(),
            },
          ],
        });
      }
      if (url === '/document/download/1') {
        return Promise.resolve({
          data: { url: 'http://example.com/doc.pdf' },
        });
      }
      return Promise.resolve({ data: {} });
    });

    window.open = jest.fn();

    renderModal();

    await waitFor(() => {
      expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('DownloadIcon').closest('button'));

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        'http://example.com/doc.pdf',
        '_blank'
      );
    });
  });
});
