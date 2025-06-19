export const shortString = (string, stringLength) => {
  return string.length > stringLength
    ? `${string.substring(0, stringLength)}...`
    : string;
};
