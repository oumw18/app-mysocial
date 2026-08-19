import { useState } from "react";
import { useUserSearch } from "../hooks/useUserProfile";

export default function Search() {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading: isLoadingUsers } = useUserSearch();

  const filteredUsers = search.trim()
    ? users.filter(({ username }) =>
        username.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : [];

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        className="input w-50 md:w-auto"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {search.trim() && (
        <div className="rounded-box bg-base-100 absolute z-1 mt-3 w-52 p-2 shadow">
          {isLoadingUsers ? (
            <span className="loading loading-dots loading-sm" />
          ) : filteredUsers.length > 0 ? (
            <ul className="menu w-full p-0">
              {filteredUsers.map((foundUser) => (
                <li key={foundUser.id}>
                  <a
                    href={`/user-profile/${foundUser.id}`}
                    onClick={() => setSearch("")}
                  >
                    {foundUser.username}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span className="px-2 py-1 text-sm opacity-60">
              Aucun utilisateur
            </span>
          )}
        </div>
      )}
    </div>
  );
}
