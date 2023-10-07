import { createSignal } from "solid-js";

import styles from "../Counter.module.css";

function Counter() {
  const [count, setCount] = createSignal(0);

  setInterval(() => setCount(count() + 1), 1000);

  return (
    <>
      <link 
        rel="stylesheet" 
        href={import.meta.resolve('../Counter.module.css')}
      />
      <div
        class={styles["bar"]}
      >
        Count: {count()}
      </div>
    </>
  );
}

export { Counter };
