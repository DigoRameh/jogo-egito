import { useState } from "react";
import TelaJogo from "./paginas/TelaJogo";
import "./index.css";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState("");

  const addPlayer = () => {
    if (!name.trim()) return;
    const exists = players.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setError("Jogador já adicionado");
      return;
    }
    setPlayers((prev) => [...prev, { name: name.trim(), cards: [] }]);
    setName("");
    setError("");
  };

  const startGame = () => {
    if (players.length >= 2) setGameStarted(true);
  };

  const colunaClasse =
    players.length > 10
      ? "tres-colunas"
      : players.length > 1
      ? "duas-colunas"
      : "";

  return (
    <>
      {!gameStarted && (
        <div className="topo-fixo">
          <h1>Egito</h1>
          <h3>Um jogo de Joiner</h3>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Adicionar Jogadores
          </h2>
          <div  className="centralizado">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="input-personalizado"
            />
            <button onClick={addPlayer} className="botao-personalizado">
              Adicionar
            </button>
            <div>
              {error && (
              <p style={{ color: "red", textAlign: "center", marginTop: "0.5rem" }}>
                {error}
              </p>
              )}
              <div className="lista-container">
                <ul className={`lista-jogadores ${colunaClasse}`}>
                  {players.map((p, i) => (<li key={i}>{p.name}</li>))}
                </ul>
              </div>
            </div>
          </div>
        </div> /* Topo-fixo */
      )}

      <div className="centralizado">
        {gameStarted && <TelaJogo jogadoresIniciais={players} />}

        {!gameStarted && (
          <div
            style={{
              position: "fixed",
              bottom: "4rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "18rem",
              textAlign: "center"
            }}
          >
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="botao-personalizado"
            >
              Iniciar Jogo
            </button>
          </div>
        )}
      </div>
    </>
  );
}
