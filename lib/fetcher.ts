// Generic fetcher for SWR
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  
  return res.json();
};

// Fetcher with params
export const fetcherWithParams = async ([url, params]: [string, Record<string, string>]) => {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`${url}?${searchParams}`);
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  
  return res.json();
};
