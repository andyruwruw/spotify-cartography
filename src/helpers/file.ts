import fs from 'fs';

export const parseJson = async (filePath: string): Promise<Record<string, unknown>> => {
  console.log(filePath);
  const fileContent = await fs.readFileSync(filePath, 'utf8');

  return JSON.parse(fileContent) as Record<string, unknown>;
};

export const writeJson = async (filePath: string, data: Record<string, unknown>): Promise<void> => {
  await fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
