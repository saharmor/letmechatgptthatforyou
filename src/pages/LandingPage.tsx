import { Link } from 'react-router-dom';
import { providers } from '../config/providers';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">Let Me AI That For You</h1>
        <p className="landing-subtitle">
          For all those people who find it easier to bother you than to ask an
          AI themselves.
        </p>

        <div className="landing-cards">
          {Object.values(providers).map((provider) => (
            <Link
              key={provider.id}
              to={`/${provider.id}`}
              className="landing-card"
              style={
                {
                  '--provider-accent': provider.accentColor,
                  '--provider-accent-light': provider.accentColorLight,
                } as React.CSSProperties
              }
            >
              <span className="landing-card-name">{provider.name}</span>
              <span className="landing-card-desc">
                Let me {provider.name} that for you
              </span>
              <span className="landing-card-arrow">&rarr;</span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="landing-footer">
        <p>Not associated with OpenAI or Anthropic in any way.</p>
      </footer>
    </div>
  );
}
