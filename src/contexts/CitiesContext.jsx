/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
const CitiesContext = createContext();

const BASE_URL = "http://localhost:9000";
function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  async function getCity(id) {
    try {
      setIsLoding(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("error fetching city");
    } finally {
      setIsLoding(false);
    }
  }
  async function createCity(newCity) {
    try {
      setIsLoding(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("data", data);
      setCities([...cities, data]);
    } catch {
      alert("error creating city");
    } finally {
      setIsLoding(false);
    }
  }
  async function deleteCity(id) {
    try {
      setIsLoding(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      setCities(cities.filter((city) => city.id !== id));
    } catch {
      alert("error deleting city");
    } finally {
      setIsLoding(false);
    }
  }
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoding(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("some error");
      } finally {
        setIsLoding(false);
      }
    }
    fetchCities();
  }, []);
  return (
    <CitiesContext.Provider
      value={{
        isLoading,
        cities,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("fuck you");
  return context;
}
export { CitiesProvider, useCities };
