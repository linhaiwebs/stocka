import { useCallback, useRef } from 'react';

export interface InteractionEvent {
  type: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface InteractionTrackingOptions {
  onInteraction?: (event: InteractionEvent) => void;
  maxEvents?: number;
}

export function useInteractionTracking(
  options: InteractionTrackingOptions = {}
) {
  const { onInteraction, maxEvents = 100 } = options;
  const eventsRef = useRef<InteractionEvent[]>([]);

  const trackInteraction = useCallback(
    (type: string, data?: Record<string, unknown>) => {
      const event: InteractionEvent = {
        type,
        timestamp: Date.now(),
        data,
      };

      eventsRef.current.push(event);

      if (eventsRef.current.length > maxEvents) {
        eventsRef.current.shift();
      }

      onInteraction?.(event);
    },
    [onInteraction, maxEvents]
  );

  const trackClick = useCallback(
    (elementId: string, elementType?: string) => {
      trackInteraction('click', { elementId, elementType });
    },
    [trackInteraction]
  );

  const trackHover = useCallback(
    (elementId: string, duration?: number) => {
      trackInteraction('hover', { elementId, duration });
    },
    [trackInteraction]
  );

  const trackTabSwitch = useCallback(
    (fromTab: string, toTab: string) => {
      trackInteraction('tab_switch', { fromTab, toTab });
    },
    [trackInteraction]
  );

  const trackFormInteraction = useCallback(
    (formId: string, fieldName: string, action: string) => {
      trackInteraction('form_interaction', { formId, fieldName, action });
    },
    [trackInteraction]
  );

  const trackVideoPlay = useCallback(
    (videoId: string, currentTime: number) => {
      trackInteraction('video_play', { videoId, currentTime });
    },
    [trackInteraction]
  );

  const trackCustomEvent = useCallback(
    (eventName: string, data?: Record<string, unknown>) => {
      trackInteraction(eventName, data);
    },
    [trackInteraction]
  );

  const getEvents = useCallback(() => {
    return [...eventsRef.current];
  }, []);

  const clearEvents = useCallback(() => {
    eventsRef.current = [];
  }, []);

  return {
    trackInteraction,
    trackClick,
    trackHover,
    trackTabSwitch,
    trackFormInteraction,
    trackVideoPlay,
    trackCustomEvent,
    getEvents,
    clearEvents,
  };
}
