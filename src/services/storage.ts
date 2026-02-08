export const storage = {
  getVisitorId(): string {
    let visitorId = localStorage.getItem('visitor_id');

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitor_id', visitorId);
    }

    return visitorId;
  },

  setSessionId(sessionId: string): void {
    sessionStorage.setItem('session_id', sessionId);
  },

  getSessionId(): string | null {
    return sessionStorage.getItem('session_id');
  },

  setTemplateId(templateId: string): void {
    sessionStorage.setItem('template_id', templateId);
  },

  getTemplateId(): string | null {
    return sessionStorage.getItem('template_id');
  },

  setTrafficLinkId(linkId: string): void {
    sessionStorage.setItem('traffic_link_id', linkId);
  },

  getTrafficLinkId(): string | null {
    return sessionStorage.getItem('traffic_link_id');
  }
};
