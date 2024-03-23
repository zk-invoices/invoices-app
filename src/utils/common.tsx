export function getShortAddress(
  address: string,
  length = 3
) {
  return `${address.slice(0, length)}...${address.slice(address.length - length)}`;
}

