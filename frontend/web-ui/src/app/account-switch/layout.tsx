import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Switch Account Type | MaxMove',
  description: 'Switch between personal, business, and driver accounts on the MaxMove platform.',
};

export default function AccountSwitchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 