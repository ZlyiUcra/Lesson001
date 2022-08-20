const baseDecodeCorrect = (encoded: string) => {
  const decoded = Buffer.from(encoded, 'base64').toString();
  const decodedArray = decoded.split(':');
  return decodedArray.length === 2 && decodedArray[0] === "admin" && decodedArray[1] === "qwerty";
}
export const authBasicParsing = (auth: string) => {
  const authArray = auth.split(' ');

  return authArray.length === 2 && authArray[0] === "Basic" && baseDecodeCorrect(authArray[1])
};
