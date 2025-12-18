import { getVehicleStatus } from '../../utils/carTableHelpers';

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

