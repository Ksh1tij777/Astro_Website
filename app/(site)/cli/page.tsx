import CliPage from '@/components/cli/CliPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World Tree Terminal | Astronomy Club LNMIIT',
  description: 'Interactive Command-Line Interface to the LNMIIT Astronomy Club World Tree Core.',
};

export default function Page() {
  return <CliPage />;
}
