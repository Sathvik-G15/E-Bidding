import styles from "../CSS/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} E-Bidding. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
