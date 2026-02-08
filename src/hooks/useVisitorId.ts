import { useState, useEffect } from 'react';
import { storage } from '../services/storage';

export function useVisitorId() {
  const [visitorId, setVisitorId] = useState<string>('');

  useEffect(() => {
    const id = storage.getVisitorId();
    setVisitorId(id);
  }, []);

  return visitorId;
}
