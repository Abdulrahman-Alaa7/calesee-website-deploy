export const truncateText = (text: string, maxLength: number) => {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
};
