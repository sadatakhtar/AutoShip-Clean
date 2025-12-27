import { getRowStyle, getVehicleStatus } from '../../utils/carTableHelpers';

describe('getVehicleStatus', () => {
  test('returns correct status strings for each code', () => {
    expect(getVehicleStatus(1)).toBe('Awaiting documents');
    expect(getVehicleStatus(2)).toBe('Documents recieved');
    expect(getVehicleStatus(3)).toBe('Awaiting customs');
    expect(getVehicleStatus(4)).toBe('Customs cleared');
    expect(getVehicleStatus(5)).toBe('IVA completed');
    expect(getVehicleStatus(6)).toBe('MOT completed');
    expect(getVehicleStatus(7)).toBe('Approved');
  });

  test('returns undefined for unknown status codes', () => {
    expect(getVehicleStatus(0)).toBeUndefined();
    expect(getVehicleStatus(99)).toBeUndefined();
    expect(getVehicleStatus(null)).toBeUndefined();
  });
});

describe('getRowStyle', () => {
  test('returns empty object when status is null', () => {
    expect(getRowStyle(null)).toEqual({});
  });

  test('returns empty object when status is undefined', () => {
    expect(getRowStyle(undefined)).toEqual({});
  });

  test('returns amber background for Submitted', () => {
    expect(getRowStyle('Submitted')).toEqual({
      backgroundColor: '#ffecb3',
    });
  });

  test('returns green background for Approved', () => {
    expect(getRowStyle('Approved')).toEqual({
      backgroundColor: '#c8e6c9',
    });
  });

  test('returns empty object for any other status', () => {
    expect(getRowStyle('Rejected')).toEqual({});
    expect(getRowStyle('Pending')).toEqual({});
    expect(getRowStyle('')).toEqual({});
  });
});