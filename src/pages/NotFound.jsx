import { Link } from 'react-router';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusLed from '../components/rack/StatusLed.jsx';
import styles from './Page.module.css';

export default function NotFound() {
  return (
    <>
      <PageHeader tag="404" title="Unit not found" />
      <p className={styles.note}>
        <StatusLed status="down" label="Page" /> This slot is empty. <Link to="/">Back to the rack</Link>
      </p>
    </>
  );
}
