import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '../App';


describe('Route validity', () => {
  it('should render Home component at "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('home-component')).toBeInTheDocument();
  });

  it('should render About component at "/about"', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('about-component')).toBeInTheDocument();
  });

  it('Should render dashboard component at "/dashboard"', () => {
        render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
  })
});


