export async function fetchData(url: string) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_SERVER_URL + url);
    return await res.json();
  } catch (error) {
    return {};
  }
}

export function fetchFile(imageUrl: string) {
  if (imageUrl) return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/${imageUrl}`;

  return '/assets/images/no-img.jpg';
}
