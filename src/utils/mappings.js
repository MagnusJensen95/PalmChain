export const mapToPlantation = responseArray => {
  let plantation = {
    name: responseArray[0],
    approved: responseArray[1],
    pendingApproval: responseArray[2],
    plantationOwnerAddress: responseArray[3],
    address: responseArray.address
  };

  return plantation;
};

export const mapToMill = response => {
  let mill = {
    GPSLatitude: response.GPSLatitude,
    GPSLongitude: response.GPSLongitude,
    millAddress: response.associatedAddress,
    millName: response.name
  };

  return mill;
};

export const isZeroAddress = address => {
  return address === "0x0000000000000000000000000000000000000000";
};
