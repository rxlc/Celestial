import React, { useState, useContext } from 'react'

import { ExperienceContext } from "../Contexts/ExperienceContext";
import { CreatingPlanetContext } from "../Contexts/CreatingPlanet";

import { Flex, Button, Text } from '@chakra-ui/react'

export default function NewPlanet() {
  const {experience, setExperience} = useContext(ExperienceContext)
  const {creatingPlanet, setCreatingPlanet} = useContext(CreatingPlanetContext);
  const [stage, setStage] = useState(0);

  function nextStage() {
    if (stage == 0) {
      experience.world.preparePlanetAt()
      setStage(stage + 1)
    } else if (stage == 1) {
      experience.world.preparePlanetVel()
      setStage(stage + 1)
    } else {
      experience.world.createPlanet();
      setCreatingPlanet(false);
      setStage(0);
    }
  }

  return (
    <Flex>
      {creatingPlanet && stage == 0 ?
        <Flex>
          <Flex
            style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            position={"fixed"}
            zIndex={1}
            pointerEvents={"none"}  
            pt="1%"
          >  
            <Text fontSize={"md"} color={"whiteAlpha.800"}>SETTING PLANET POSITION</Text>
          </Flex>
          <Flex
            style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="center"
            position={"fixed"}
            zIndex={1}
            pointerEvents={"none"}  
            pb="5%"
          >  
            <Button pointerEvents={"all"} colorScheme='gray' variant='solid' onClick={nextStage}>
              Continue
            </Button>
          </Flex>
        </Flex>
      : null }

      {creatingPlanet && stage == 1 ?
        <Flex>
          <Flex
            style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            position={"fixed"}
            zIndex={1}
            pointerEvents={"none"}  
            pt="1%"
          >  
            <Text fontSize={"md"} color={"whiteAlpha.800"}>SETTING PLANET ATTRIBUTES</Text>
          </Flex>
          <Flex
            style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="center"
            position={"fixed"}
            zIndex={1}
            pointerEvents={"none"}  
            pb="5%"
          >  
            <Button pointerEvents={"all"} colorScheme='gray' variant='solid' onClick={nextStage}>
              Continue
            </Button>
          </Flex>
        </Flex>
      : null}

      {creatingPlanet && stage == 2 ?
        <Flex>
          <Flex
            style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            position={"fixed"}
            zIndex={1}
            pointerEvents={"none"}  
            pt="1%"
          >  
            <Text fontSize={"md"} color={"whiteAlpha.800"}>SETTING PLANET INITIAL VELOCITY</Text>
          </Flex>
          <Flex
            style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="center"
            position={"fixed"}
            zIndex={1}
            pointerEvents={"none"}  
            pb="5%"
          >  
            <Button pointerEvents={"all"} colorScheme='gray' variant='solid' onClick={nextStage}>
              Create Planet
            </Button>
          </Flex>
        </Flex>
      : null}
  </Flex>
  )
}
