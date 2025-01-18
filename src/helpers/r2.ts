export const getR2Url = (objectPath: string): string => {
  if (!objectPath) {
    return null;
  }

  const key = process.env.CLOUDFLARE_R2_PUBLIC_KEY;

  return `https://pub-${key}.r2.dev/${objectPath}`;
};
