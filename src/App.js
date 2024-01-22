import "./App.css";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import SearchInput from "./Search";

function App() {
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "country",
    direction: "ascending",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?results=40");
        const data = await response.json();
        setFetchedUsers(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!fetchedUsers) return;

    const lowerCaseQuery = query.toLowerCase();
    const searchedUsers = fetchedUsers.filter((user) =>
      user.name.first.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(searchedUsers);
  }, [query]);

  useEffect(() => {
    console.log("filteredUsers0", filteredUsers);
    if (filteredUsers.length > 0) {
      setAllUser(filteredUsers);
    }
  }, [filteredUsers]);

  const requestSort = (key) => {
    setQuery("");
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // avoid unnecessary render
  const sortedUsers = useMemo(() => {
    return [...fetchedUsers].sort((a, b) =>
      sortConfig.direction === "ascending"
        ? a.location.country.localeCompare(b.location.country)
        : b.location.country.localeCompare(a.location.country)
    );
  }, [sortConfig.direction, fetchedUsers]);

  useEffect(() => {
    setAllUser(sortedUsers);
  }, [sortedUsers]);

  return (
    <div className="App">
      {fetchedUsers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                <SearchInput setQuery={setQuery} query={query} />
              </th>
              <th onClick={() => requestSort("country")}>
                Country{" "}
                {sortConfig.key === "country"
                  ? sortConfig.direction === "ascending"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th>City</th>
              <th>Email</th>
              <th>Timezone</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {allUser.map((user) => (
              <tr key={user.email}>
                <td>{user.name.title + " " + user.name.first}</td>
                <td>{user.location.country}</td>
                <td>{user.location.city}</td>
                <td>{user.email}</td>
                <td>{user.location.timezone.offset}</td>
                <td>{user.picture.thumbnail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
