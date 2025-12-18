 export const getVehicleStatus = (status) => {
    if (status === 1) return 'Awaiting documents';
    if (status === 2) return 'Documents recieved';
    if (status === 3) return 'Awaiting customs';
    if (status === 4) return 'Customs cleared';
    if (status === 5) return 'IVA completed';
    if (status === 6) return 'MOT completed';
    if (status === 7) return 'Approved';
  };