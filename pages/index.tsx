import DarkModeToggle from '../components/DarkModeToggle';
import NavBar from '../components/NavBar';

/**
 * Home page describing the playground and linking to editor pages.
 */
export default function HomePage() {
  return (
    <div>
      <h1>Document Editor Playground</h1>
      <DarkModeToggle />
      <p>Select an editor to experiment with:</p>
      <NavBar />
    </div>
  );
}
