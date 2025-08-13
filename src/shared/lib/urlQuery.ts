// src/shared/lib/urlQuery.ts
import { useNavigate, useLocation } from 'react-router-dom';

export function useUpdateURL() {
  const navigate = useNavigate();
  const location = useLocation();

  return (params: Record<string, any>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) sp.set(key, String(value));
    });
    navigate(`${location.pathname}?${sp.toString()}`, { replace: true });
  };
}
