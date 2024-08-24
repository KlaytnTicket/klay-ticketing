import { useState } from 'react';

export default function useMutation(api) {
  const [fetchState, setFetchState] = useState({ data: undefined, isLoading: false, error: undefined });

  async function mutation(formData, apiUri = api, method = 'POST') {
    setFetchState({ isLoading: true, error: false });
    await fetch(apiUri, {
      method,
      mode: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const jsonData = await response.json();
        setFetchState({ data: jsonData, isLoading: false });
      })
      .catch((error) => {
        setFetchState({ isLoading: false, error });
      });
  }

  async function clear() {
    setFetchState({ data: undefined, isLoading: false, error: undefined });
  }

  return { mutation, clear, ...fetchState };
}
