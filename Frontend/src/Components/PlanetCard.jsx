import React, { useState, useContext, memo } from 'react';
import { Text, Divider, Flex, Box} from '@chakra-ui/react';
import { motion } from "framer-motion" 

import { ExperienceContext } from '../Contexts/ExperienceContext';

const PlanetCard = memo(({planet}) => {
        const MotionFlex = motion(Flex);
        const {experience, setExperience} = useContext(ExperienceContext);

        const [selectedPlanet, setSelectedPlanet] = useState(-1);

        const handleClick = () => {
           if (planet.id == selectedPlanet) {
                setSelectedPlanet(-1)
                if (experience) experience.world.focusOrigin();
           } else {
                setSelectedPlanet(planet.id)
                for (let i = 0; i < experience.world.planets.length; i++) {
                    if (experience.world.planets[i].id == planet.id) {
                        experience.world.focus(experience.world.planets[i].instance, 5)
                        experience.world.keepTarget(experience.world.planets[i].instance)
                        break;
                    }
                }
           }

        };

        return (
            <MotionFlex bg="gray.800" width="100%" color="white" key={planet.id} cursor={"pointer"} onClick={handleClick} display="flex" flexDirection={'row'} alignSelf="flex-start" p="12px" borderRadius={"3px"} whileHover={{ opacity: 0.7}} 
                layout                  
            >
                <Divider orientation="vertical" mx="8px"/>
                <Flex flexDirection={"column"} pointerEvents={"all"}>
                    <Text fontSize="10px" color="gray.300">{planet.id}</Text>
                </Flex>

                {selectedPlanet != -1 ? 
                    <Flex
                        style={{width: window.innerWidth, height: window.innerHeight, position: "fixed", left: "0px", top: "0px"}}
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        position={"fixed"}
                        zIndex={1}
                        ml="20px"
                        pointerEvents={"none"}  
                        pt="1%"
                    >  
                        <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            p="15px"
                            mt="20px"
                            color="white"
                            borderRadius="5px"
                        >
                            <Text fontSize="md" textAlign={"center"} color="whiteAlpha.800">
                            Planet Attributes
                            </Text>
                            <Text fontSize="sm">Mass: {Math.floor(planet.mass * 100)/100}kg</Text>
                            <Text fontSize="sm">Diameter: {Math.floor(planet.radius * 2 * 100)/100}m</Text>

                        </Box>
                    </Flex>
                : null }  
            </MotionFlex>
        )
    },
    (next, prev) => next.planet === prev.planet
);

export default PlanetCard
