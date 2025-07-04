import { Link } from 'react-router-dom';
import style from './Home.module.css';
import assignmentwork from '../../components/Assets/assignmentwork.jpg'; 

function Home() {
  return (
    <div className={style.HomePage}>
      {/* Hero Section */}
      <div className={style.HomeContainer}>
        <div className={style.content}>
          <div className={style.textSection}>
            <h1>Your Smart Hub for Assignments and Deadlines</h1>
            <p>Centralize your work, streamline communication, and keep everything on track.</p>
            <Link to="/signup" className={style.tryButton}>Try it out</Link>
          </div>
          <div className={style.imageSection}>
            <img src={assignmentwork} alt="Assignment Work" />
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className={style.servicesSection}>
  <h2 className={style.sectionTitle}>🚀 What We Offer</h2>

  <div className={style.cardGrid5}>
    <div className={style.card}>
      <div className={style.icon}>👨‍💻</div>
      <h3>Programming Help</h3>
      <ul>
        <li>Java, Python, JavaScript</li>
        <li>TypeScript & Full-stack</li>
        <li>Hands-on coding guidance</li>
      </ul>
    </div>

    <div className={style.card}>
      <div className={style.icon}>🧠</div>
      <h3>AI & ML Projects</h3>
      <ul>
        <li>ML, DL, NLP</li>
        <li>TensorFlow, PyTorch</li>
        <li>LangChain, Generative AI</li>
      </ul>
    </div>

    <div className={style.card}>
      <div className={style.icon}>☁️</div>
      <h3>Cloud & DevOps</h3>
      <ul>
        <li>AWS, Azure, GCP</li>
        <li>ETL, Serverless Apps</li>
        <li>Terraform, CI/CD</li>
      </ul>
    </div>

    <div className={style.card}>
      <div className={style.icon}>📚</div>
      <h3>Core Subjects</h3>
      <ul>
        <li>Java, Python, JS</li>
        <li>React, Node.js, SQL</li>
        <li>Docker, Firebase, AI</li>
      </ul>
    </div>

    <div className={style.card}>
      <div className={style.icon}>💼</div>
      <h3>Services Offered</h3>
      <ul>
        <li>Assignments & Projects</li>
        <li>Debugging, Code Review</li>
        <li>Reports, Live Demos</li>
      </ul>
    </div>
  </div>
</div>
</div>
  );
}

export default Home;
