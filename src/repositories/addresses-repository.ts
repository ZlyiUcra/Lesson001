const addresses = [{id: 1, value: "Nezalezhnosti, 13"}, {id: 2, value: "Vorobkevycha, 32"}];

export const findAddresses = () => {
  return addresses
}

export const findAddressById = (id: number) => {
  return addresses.find(address => address.id === id);
}