import ChassisBox from './ChassisBox.jsx';
import RackEar from './RackEar.jsx';
import styles from './Rack.module.css';

// Non-clickable rack equipment.
// variant: 'blank' (vented filler), 'brush' (cable pass-through), 'console' (LCD), 'appliance' (screen).
export default function RackPanel({ u = 1, variant = 'blank', children }) {
  const hasBody = variant === 'console' || variant === 'appliance';

  return (
    <div className={`${styles.slot} ${styles[`u${u}`]}`}>
      <div className={styles.drawer}>
        {hasBody && <ChassisBox />}
        <div className={`${styles.faceplate} ${styles[variant]}`}>
          <RackEar />
          <div className={styles.panelBody}>
            {variant === 'blank' && <span className={styles.ventSlots} aria-hidden="true" />}
            {variant === 'brush' && <span className={styles.brushStrip} aria-hidden="true" />}
            {hasBody && <div className={styles.screen}>{children}</div>}
          </div>
          <RackEar />
        </div>
      </div>
    </div>
  );
}
