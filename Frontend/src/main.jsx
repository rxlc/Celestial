import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'

import { ExperienceProvider } from "./Contexts/ExperienceContext";
import { CreatingPlanetProvider } from './Contexts/CreatingPlanet';
import { PlanetsProvider } from './Contexts/PlanetsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <ExperienceProvider>
        <CreatingPlanetProvider>
          <PlanetsProvider>
            <App />
          </PlanetsProvider>
        </CreatingPlanetProvider>
      </ExperienceProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
