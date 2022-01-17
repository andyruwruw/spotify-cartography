interface WindowNavigatorWithOpenBlob extends Navigator {
  msSaveOrOpenBlob: (blob: Blob, fileName: string) => boolean;
}

/**
 * Saves a JSON file to user's computer of data.
 *
 * @param {object} data Data to be saved.
 * @param {string} filename File name to save as.
 */
export const downloadJson = (
  data: Record<string, any>,
  filename: string,
) => {
  const file = new Blob(
    [
      JSON.stringify(
        data,
        null,
        2,
      ),
    ], { type: 'application/json' },
  );

  if ('msSaveOrOpenBlob' in window.navigator) {
    (window.navigator as WindowNavigatorWithOpenBlob).msSaveOrOpenBlob(file, filename);
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
