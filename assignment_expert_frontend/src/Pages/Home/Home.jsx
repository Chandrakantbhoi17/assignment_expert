import style from './Home.module.css';
function Home() {
  return (
    <div className={style.HomeContainer} style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🏠 Home Page Demo</h1>
      <p>This is just one div to show the home page is working.</p>
    </div>
  );
}

export default Home;
