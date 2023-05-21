import React, { createContext, useState } from "react";

export const CreatingPlanetContext = createContext();

export function CreatingPlanetProvider({ children }) {
  const [creatingPlanet, setCreatingPlanet] = useState(false);

  return (
    <CreatingPlanetContext.Provider value={{ creatingPlanet, setCreatingPlanet }}>
      {children}
    </CreatingPlanetContext.Provider>
  );
}