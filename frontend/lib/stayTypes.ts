export type StayRequest = {
  startTime: string,
  endTime: string,
  price: string,
  guest: `0x${string}`,
  host: `0x${string}`,
  arbitrationDeadline: string,
  arbiter: `0x${string}`,
  tokenURI: string,
}

export type StayRequestApproval = {
  approvalSignature: string;
} & StayRequest;