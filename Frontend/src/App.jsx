import ThreeScene from './ThreeScene'
import Planets from './Components/Planets'
import NewPlanet from './Components/NewPlanet'

function App() {
  return (
    <div className="App" style={{display: "flex", width: window.innerWidth, height: window.innerHeight, alignItems: "center", justifyItems:"center"}}>
      <Planets/>
      <NewPlanet/>
      <ThreeScene/>
    </div>
  )
}

export default App
