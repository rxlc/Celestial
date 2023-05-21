import React, { useContext, useEffect } from 'react'

import { Flex, Button, Card, Text, VStack } from '@chakra-ui/react'

import { ExperienceContext } from "../Contexts/ExperienceContext";
import { CreatingPlanetContext } from "../Contexts/CreatingPlanet";
import { PlanetsContext } from '../Contexts/PlanetsContext';
import { AnimatePresence } from "framer-motion" 

import PlanetCard from './PlanetCard';

export default function Planets() {
  const {experience, setExperience} = useContext(ExperienceContext)
  const {planets, setPlanets} = useContext(PlanetsContext)
  const {creatingPlanet, setCreatingPlanet} = useContext(CreatingPlanetContext)

  function newPlanet() {
      setCreatingPlanet(true);
      if (experience) experience.world.preparePlanetPos();
  }

  useEffect(() => {
    document.addEventListener("updatePlanets", () => {
      if (experience) {
        setPlanets(experience.world.planets);
      }
    })
  }, [experience])

  return (
    <Flex
      style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-end"
      position={"fixed"}
      zIndex={1}
      pointerEvents={"none"}
      pr="8px"
    >
      {
        !creatingPlanet ? 
        <Button pointerEvents={"all"} colorScheme='yellow' variant='outline' onClick={newPlanet}>
          New Planet
        </Button>
      :
        null
      }

      <Flex 
        pointerEvents={"all"}
        flexDir={"column"}
        mt="12px"
        width="10%"
      >
        <Flex flexDir={"row"} opacity={planets.length > 0 ? 1 : 0} alignItems="flex-end" borderBottom={"1px solid white"}>
        <Text color="white" fontSize={"18px"} ml="5px" width="95%" fontWeight={"semibold"}
          style={{  
            transition: 'opacity 0.3s ease-in-out',
        }}
        >Planets:</Text>
      </Flex>

      <VStack w={400} spacing={3} mt="4px" width="100%" height="200px">
          <AnimatePresence>
            {planets.map((planet) => {
              return (
                <PlanetCard key={planet.id} planet={planet}/>
              )
            })}
          </AnimatePresence>
      </VStack>
      </Flex>
    </Flex>
  )
}
