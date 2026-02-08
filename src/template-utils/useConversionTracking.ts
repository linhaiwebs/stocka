import { useCallback, useRef } from 'react';

export interface ConversionTrackingOptions {
  onConversion?: (conversionType?: string) => void;
  allowMultiple?: boolean;
}

export function useConversionTracking(
  options: ConversionTrackingOptions = {}
) {
  const { onConversion, allowMultiple = false } = options;
  const hasConvertedRef = useRef(false);

  const trackConversion = useCallback(
    (conversionType?: string) => {
      if (!allowMultiple && hasConvertedRef.current) {
        return false;
      }

      hasConvertedRef.current = true;
      onConversion?.(conversionType);

      return true;
    },
    [allowMultiple, onConversion]
  );

  const hasConverted = useCallback(() => {
    return hasConvertedRef.current;
  }, []);

  const resetConversion = useCallback(() => {
    hasConvertedRef.current = false;
  }, []);

  return {
    trackConversion,
    hasConverted,
    resetConversion,
  };
}
