import fs from 'fs';

export const writeJson = (filePath: string, data: Record<string, unknown>): void => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file');
    }
  });
};

export const downloadJson = (data: Record<string, any>, filename: string) => {
  const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  if ('msSaveOrOpenBlob' in window.navigator) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else { // Others
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};
