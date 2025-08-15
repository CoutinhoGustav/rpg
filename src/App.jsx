import React, { useState } from "react";
import Intro from "./components/Intro";
import CharacterCreation from "./components/CharacterCreation";
import Transition from "./components/Transitions";
import Capitulo1 from "./components/Capitulo1";
import Capitulo2 from "./components/Capitulo2";
import Capitulo3 from "./components/Capitulo3";
import Capitulo4 from "./components/Capitulo4";
import Capitulo5 from "./components/Capitulo5"; // Novo Capítulo
import "./App.css";
import "./components/components.css";

export default function App() {
  const [step, setStep] = useState(0); 
  const [player, setPlayer] = useState({ 
    name: "", 
    gender: "", 
    class: "", 
    hp: 100, 
    level: 1, 
    xp: 0, 
    attack: 5, 
    defense: 3 
  });
  const [treasures, setTreasures] = useState([]); // Inventário global

  const nextStep = () => setStep(step + 1);

  return (
    <div className="App">
      {step === 0 && <Intro onNext={nextStep} />}
      {step === 1 && <CharacterCreation onNext={nextStep} setPlayer={setPlayer} />}
      {step === 2 && <Transition onNext={nextStep} />}
      {step === 3 && (
        <Capitulo1 
          player={player} 
          onNext={nextStep} 
          treasures={treasures} 
          setTreasures={setTreasures} 
        />
      )}
      {step === 4 && (
        <Capitulo2 
          player={player} 
          treasures={treasures} 
          onNext={nextStep}
          setTreasures={setTreasures} 
        />
      )}
      {step === 5 && (
        <Capitulo3
          player={player} 
          treasures={treasures} 
          setTreasures={setTreasures} 
          onNext={nextStep} // Avança para Capítulo 4
        />
      )}
      {step === 6 && (
        <Capitulo4
          player={player} 
          treasures={treasures} 
          setTreasures={setTreasures}
          onNext={nextStep} // Avança para Capítulo 5
        />
      )}
      {step === 7 && (
        <Capitulo5
          player={player} 
          treasures={treasures} 
          setTreasures={setTreasures} 
          onNext={nextStep} // Futuro Capítulo 6
        />
      )}
      {step > 7 && (
        <div>
          <h2>🎉 Parabéns, {player.name}!</h2>
          <p>Você completou todos os capítulos disponíveis até agora.</p>
        </div>
      )}
    </div>
  );
}
