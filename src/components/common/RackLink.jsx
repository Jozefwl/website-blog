import { Link, NavLink } from 'react-router';
import { useRackNavigation } from '../../hooks/useRackNavigation.js';
import { isPlainLeftClick } from '../../lib/transitions.js';

// A router link that plays the rack transition. Modified clicks keep the browser default.
// `nav` renders a NavLink (active-state className function supported).
export default function RackLink({ to, nav = false, onClick, ...rest }) {
  const go = useRackNavigation();
  const Component = nav ? NavLink : Link;

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || !isPlainLeftClick(event)) return;
    event.preventDefault();
    go(to);
  }

  return <Component to={to} onClick={handleClick} {...rest} />;
}
