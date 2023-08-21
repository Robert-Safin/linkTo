import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className="flex w-full h-screen justify-center align-middle items-center">
    <div className={styles.ldsRing}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    </div>
  );
};

export default Loader;
