import "./NavBar.css";

export function NavBar({ onBack, onLogout, rightSlot, middleSlot = null }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {onBack && (
          <button onClick={onBack} className="navbar-btn">← Back</button>
        )}
        <span className="navbar-logo">INDI.FIT</span>
      </div>

      {middleSlot && (
        <div className="navbar-center">{middleSlot}</div>
      )}

      <div className="navbar-right">
        {rightSlot}
        {onLogout && (
          <button onClick={onLogout} className="navbar-btn">Logout</button>
        )}
      </div>
    </nav>
  );
}
