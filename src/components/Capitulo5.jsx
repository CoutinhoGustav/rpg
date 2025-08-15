import React, { useState, useEffect } from "react";
import usePlayerProgress from "../hooks/usePlayerProgress";

export default function Capitulo5({ player, treasures, setTreasures, onNext }) {
  const [storyStep, setStoryStep] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showItemChoice, setShowItemChoice] = useState(false);
  const [foundItem, setFoundItem] = useState(null);
  const [combatStarted, setCombatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTreasures, setAvailableTreasures] = useState([...treasures]);

  // Hook para progressão do jogador
  const { hp, attack, defense, skillPointsToDistribute, gainXP, allocateSkill, setHP } =
    usePlayerProgress(player);

  const [classMessage, setClassMessage] = useState("");

  const [enemy, setEnemy] = useState({
    name: "Guardião da Caverna",
    hp: 250,
    strength: 20,
  });

  const storyTexts = [
    `${player.name} adentra a parte mais profunda da caverna, onde uma luz estranha brilha.`,
    "Um pergaminho antigo aparece com um enigma bíblico!",
  ];

  const puzzles = [
    {
      question: "Quem dividiu o Mar Vermelho com o poder de Deus?",
      reference: "Êxodo 14",
      options: ["Moisés", "Josué", "Davi", "Elias"],
      answer: "Moisés",
      reward: { name: "Anel da Proteção", atk: 3, def: 5 },
    },
  ];

  const [currentPuzzle] = useState(0);

  // Mensagem da classe
  useEffect(() => {
    switch (player.class) {
      case "Guerreiro da Fé":
        setClassMessage("💪 Guerreiro da Fé: +2 de ataque ao usar tesouros!");
        break;
      case "Sábio dos Salmos":
        setClassMessage("📖 Sábio dos Salmos: +2 de defesa ao usar tesouros!");
        break;
      case "Curador da Luz":
        setClassMessage("✨ Curador da Luz: +10 HP ao usar tesouros de cura!");
        break;
      default:
        setClassMessage("");
    }
  }, [player.class]);

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) setStoryStep(storyStep + 1);
    else setShowPuzzle(true);
  };

  const handleAnswer = (option) => {
    if (option === puzzles[currentPuzzle].answer) {
      setFeedback(`✅ Correto! Você encontrou: ${puzzles[currentPuzzle].reward.name}`);
      setFoundItem(puzzles[currentPuzzle].reward);
      setTimeout(() => {
        setFeedback("");
        setShowItemChoice(true);
      }, 2000);
    } else {
      setFeedback("❌ Errado! Tente novamente.");
    }
  };

  const handleItemChoice = (choice) => {
    if (choice) {
      setTreasures([...treasures, foundItem]);
      setAvailableTreasures([...availableTreasures, foundItem]);
    }
    setShowItemChoice(false);
    setShowPuzzle(false);
    setStoryStep(storyTexts.length);
    setCombatStarted(true);
  };

  const playerAttack = (usedTreasure) => {
    let damage = attack;

    if (usedTreasure) {
      if (player.class === "Guerreiro da Fé") damage += 2;
      else if (player.class === "Curador da Luz" && usedTreasure.name === "Escudo da Fé") {
        const healed = 20;
        setHP(hp + healed);
        setMessage(`✨ Curador da Luz: +${healed} HP usando ${usedTreasure.name}`);
        setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
        return;
      }

      switch (usedTreasure.name) {
        case "Anel da Proteção":
          damage += 3;
          setMessage(`Você usou ${usedTreasure.name}! +3 de ataque.`);
          break;
        case "Chave de Sabedoria":
          damage += 5;
          setMessage(`Você usou ${usedTreasure.name}! +5 de ataque.`);
          break;
        case "Escudo da Fé":
          const healed = 20;
          setHP(hp + healed);
          setMessage(`Você usou ${usedTreasure.name} e recuperou ${healed} HP!`);
          break;
        default:
          setMessage(`Você usou ${usedTreasure.name || usedTreasure}.`);
      }

      setAvailableTreasures(availableTreasures.filter((t) => t !== usedTreasure));
    } else {
      setMessage(`Você atacou normalmente e causou ${damage} de dano.`);
    }

    const newEnemyHP = Math.max(enemy.hp - damage, 0);
    setEnemy({ ...enemy, hp: newEnemyHP });

    if (newEnemyHP > 0) setTimeout(enemyAttack, 1000);
    else {
      setMessage("🎉 Você derrotou o inimigo!");
      gainXP(40);
    }
  };

  const enemyAttack = () => {
    const damage = Math.max(enemy.strength - defense, 1);
    setHP(Math.max(hp - damage, 0));
    setMessage(`${enemy.name} atacou! Você perdeu ${damage} de HP.`);
  };

  return (
    <div className="story-chapter">
      <h2>Capítulo 5: O Guardião da Caverna</h2>
      {classMessage && <p className="class-info">{classMessage}</p>}

      {/* História / Puzzle */}
      {!combatStarted && !showItemChoice && storyStep < storyTexts.length && (
        <>
          <p>{storyTexts[storyStep]}</p>
          <button onClick={nextStory}>Avançar</button>
        </>
      )}

      {showPuzzle && !showItemChoice && (
        <div className="puzzle">
          <h3>Desafio Bíblico!</h3>
          <p>{puzzles[currentPuzzle].question}</p>
          <p className="reference">📖 Referência: {puzzles[currentPuzzle].reference}</p>
          <div className="options">
            {puzzles[currentPuzzle].options.map((opt) => (
              <button key={opt} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
          {feedback && <p>{feedback}</p>}
        </div>
      )}

      {/* Escolha do item */}
      {showItemChoice && foundItem && (
        <div className="item-choice">
          <h3>Você encontrou {foundItem.name}!</h3>
          <p>ATK: {foundItem.atk} | DEF: {foundItem.def}</p>
          <p>Deseja adicionar ao inventário?</p>
          <button onClick={() => handleItemChoice(true)}>Sim</button>
          <button onClick={() => handleItemChoice(false)}>Não</button>
        </div>
      )}

      {/* Combate */}
      {combatStarted && hp > 0 && enemy.hp > 0 && (
        <div className="combat">
          <p>🛡 {player.name} HP: {hp} | Inimigo HP: {enemy.hp}</p>
          <p>{message}</p>
          <div className="combat-actions">
            <button onClick={() => playerAttack(null)}>Atacar Normal</button>
            {availableTreasures.length > 0 && (
              <div className="inventory">
                <p>Inventário:</p>
                {availableTreasures.map((treasure, index) => (
                  <button key={index} onClick={() => playerAttack(treasure)}>
                    {treasure.name || treasure}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Distribuição de XP */}
      {enemy.hp <= 0 && skillPointsToDistribute > 0 && (
        <div className="level-up">
          <p>Distribua seus pontos restantes ({skillPointsToDistribute}):</p>
          <button onClick={() => allocateSkill("attack")}>Ataque</button>
          <button onClick={() => allocateSkill("defense")}>Defesa</button>
          <button onClick={() => allocateSkill("hp")}>HP</button>
          <p>
            Skills atuais: Ataque {attack}, Defesa {defense}, HP {hp}
          </p>
        </div>
      )}

      {/* Fim do Capítulo */}
      {enemy.hp <= 0 && skillPointsToDistribute === 0 && (
        <>
          <p>Parabéns! Você completou o Capítulo 5 com sucesso!</p>
          <button onClick={onNext}>Avançar para Capítulo 6</button>
        </>
      )}
    </div>
  );
}
