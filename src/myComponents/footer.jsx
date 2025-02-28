import React from "react";
import "../css/footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {


      return (
    <div id="footerBody" >
      <div className="box1">
        <p>© 2025 Rivals FC. All Rights Reserved.</p>
        </div>
        <div className="box2">
          <p className="temp">Made with ❤️ by <strong>Kumail-MKA</strong></p>
          <div className="footerIcons">
          <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLink} />
            </a>
            <a href="https://www.linkedin.com/in/mka-786cs14/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/mkumail14" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://www.instagram.com/kumail14_/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://wa.me/923328041069" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href="mailto:mkumail7860@gmail.com">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          
          
        </div>
      </div>
    </div>
  );
}
