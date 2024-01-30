import React from "react";
import styles from "./Navbar.module.css";
import { links } from "./links.json";
import { Link } from "react-router-dom";

type Link = {
  label: string;
  href: string;
};

const Links: React.FC<{ links: Link[] }> = ({ links }) => {
  return (
    <div className={styles["links-container"]}>
      {links.map((link: Link) => {
        return (
          <div key={link.href} className={styles["link"]}>
            <a href={link.href}>{link.label}</a>
          </div>
        );
      })}
    </div>
  );
};

const Navbar: React.FC<{}> = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles["logo-container"]}>
        <a href="/">Pet Adoption Platform</a>
      </div>

      <Links links={links}></Links>
    </nav>
  );
};

export default Navbar;
