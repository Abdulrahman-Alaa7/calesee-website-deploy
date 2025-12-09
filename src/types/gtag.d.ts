interface GtagConfigParams {
  page_path?: string;
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | string[]
    | number[]
    | boolean[]
    | Record<string, unknown>
    | Record<string, unknown>[];
}

interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  items?: Record<string, unknown>[];
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | string[]
    | number[]
    | boolean[]
    | Record<string, unknown>
    | Record<string, unknown>[];
}

type GtagFunction = {
  (command: "config", targetId: string, config?: GtagConfigParams): void;
  (command: "event", eventName: string, params?: GtagEventParams): void;
  (command: "js", date: Date): void;
};

declare global {
  interface Window {
    gtag: GtagFunction;
    dataLayer: unknown[];
  }
}

export {};
