declare module '@calcom/embed-react' {
  export function getCalApi(options?: { namespace?: string }): Promise<{
    (
      action: 'ui',
      options: {
        theme?: 'dark' | 'light';
        hideEventTypeDetails?: boolean;
        layout?: 'month_view' | 'week_view' | 'day_view';
      }
    ): void;
  }>;
}
