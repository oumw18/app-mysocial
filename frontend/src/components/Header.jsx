import { useAuth } from "../hooks/useAuth";
import Search from "./Search";

export default function Header() {
  const { data: user } = useAuth();

  const onLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
    return;
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl" href="/">
          My<span className="text-accent">Social</span>
        </a>
      </div>
      {/* search */}
      <div className="navbar-center">
        <Search />
      </div>
      {/* profil */}
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline btn-accent"
          >
            {user?.username}
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/profil">Profile</a>
            </li>
            <li>
              <a onClick={onLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
