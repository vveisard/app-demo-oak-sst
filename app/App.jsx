import styles from "./App.module.css";
import { Counter } from "./common/Counter.jsx";

function App() {
  return (
    <>
      <link 
        rel="stylesheet" 
        href={import.meta.resolve('./App.module.css')}
      />
      <div
        className={styles["foo"]}
      >
        Hello, world!
        <Counter />
      </div>
    </>
  );
}

export default App;
