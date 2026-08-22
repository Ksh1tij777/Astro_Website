import ScrollProvider from '@/components/ScrollProvider';
import SpaceBackground from '@/components/SpaceBackground';
import Nav from '@/components/Nav';
import CelestialGauge from '@/components/CelestialGauge';
import LaunchLoader from '@/components/LaunchLoader';
import AstronautWalker from '@/components/AstronautWalker';
import { FragmentProvider } from '@/components/fragments/FragmentContext';
import FragmentHUD from '@/components/fragments/FragmentHUD';
import { TeamProvider } from '@/components/team/TeamContext';
import TeamGate from '@/components/team/TeamGate';
import TeamHUD from '@/components/team/TeamHUD';

// The marketing/ARG site's shell — Nav, space background, the fragment/team
// HUDs, and the team login gate. Applies to "/" and "/cli" only (this route
// group doesn't affect the URL). Kept out of the root layout so /admin gets
// a clean shell with none of this.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeamProvider>
      <FragmentProvider>
        <LaunchLoader />
        <TeamGate />
        <ScrollProvider>
          <SpaceBackground />
          <div className="vignette" aria-hidden />
          <Nav />
          <CelestialGauge />
          <AstronautWalker />
          <FragmentHUD />
          <TeamHUD />
          <main className="main">{children}</main>
        </ScrollProvider>
      </FragmentProvider>
    </TeamProvider>
  );
}
