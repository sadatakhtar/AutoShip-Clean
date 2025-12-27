export const getVehicleStatus = (status) => {
  if (status === 1) return 'Awaiting documents';
  if (status === 2) return 'Documents recieved';
  if (status === 3) return 'Awaiting customs';
  if (status === 4) return 'Customs cleared';
  if (status === 5) return 'IVA completed';
  if (status === 6) return 'MOT completed';
  if (status === 7) return 'Approved';
};

export const getRowStyle = (status) => {
  if (!status) return {};

  switch (status) {
    case 'Submitted':
      return { backgroundColor: '#ffecb3' }; // amber-200
    case 'Approved':
      return { backgroundColor: '#c8e6c9' }; // green-200
    default:
      return {};
  }
};
