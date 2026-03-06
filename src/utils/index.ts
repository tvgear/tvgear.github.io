export function replaceAll(string: string, search: string, replace: string) {
  return string.split(search).join(replace);
}
export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => fallbackCopyTextToClipboard(text));
  } else {
    return Promise.resolve(fallbackCopyTextToClipboard(text));
  }
}

function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Ensure the textarea is not visible
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}
