import { useEffect, useState } from "react";
import "../index.css";

export default function TelaJogo({ jogadoresIniciais }) {
  const [jogadores, setJogadores] = useState(() => {
    const inicial = jogadoresIniciais?.map((j, index) => ({
      id: j.id ?? index,
      name: j.name,
      cards: j.cards || [],
      points: 0,
      intercepted: 0,
      responded: 0,
    }));
    localStorage.setItem("jogadores", JSON.stringify(inicial));
    return inicial;
  });

  const [jogadorAtual, setJogadorAtual] = useState(0);
  const [cartas, setCartas] = useState([]);
  const [cartaAtual, setCartaAtual] = useState(null);
  const [fase, setFase] = useState(1);
  const [jogadorEscolhido, setJogadorEscolhido] = useState(null);
  const [mostraInterceptar, setMostraInterceptar] = useState(false);
  const [jogadorInterceptador, setJogadorInterceptador] = useState(null);
  const [vencedor, setVencedor] = useState(null);

  useEffect(() => {
    fetch("/perguntas.json")
      .then((res) => res.json())
      .then((data) => setCartas(data.sort(() => Math.random() - 0.5)));
  }, []);

  const verificarVitoria = (jogador) => {
    const contagem = {};
    jogador.cards.forEach((carta) => {
      contagem[carta.simbolo] = (contagem[carta.simbolo] || 0) + 1;
      if (contagem[carta.simbolo] >= 2) { // MUDAR PARA 5 QUANDO ADICIONAR TODAS AS CARTAS
        setVencedor(jogador.name);
      }
    });
  };

  const proximaRodada = () => {
    setCartaAtual(null);
    setJogadorEscolhido(null);
    setJogadorInterceptador(null);
    setMostraInterceptar(false);
    setFase(1);
    setJogadorAtual((prev) => (prev + 1) % jogadores.length);
  };

  const tirarCarta = () => {
    if (!cartas.length) return alert("Acabaram as cartas!");
    setCartaAtual(cartas[0]);
    setCartas((prev) => prev.slice(1));
    setFase(2);
  };

  const escolherJogador = (jog) => {
    setJogadorEscolhido(jog);
    setFase(3);
  };

  const revelarCarta = () => setFase(4);

  const salvarJogadores = (atualizados) => {
    setJogadores(atualizados);
    localStorage.setItem("jogadores", JSON.stringify(atualizados));
  };

  const atribuirCarta = (alvo) => {
    const atualizados = jogadores.map(j =>
      j.name === alvo.name
        ? { ...j, cards: [...j.cards, cartaAtual] }
        : j
    );
    salvarJogadores(atualizados);
    const jogadorAtualizado = atualizados.find(j => j.name === alvo.name);
    verificarVitoria(jogadorAtualizado);
  };

  const responder = () => {
    atribuirCarta(jogadorEscolhido);
    proximaRodada();
  };

  const desistir = () => proximaRodada();
  const interceptar = () => setMostraInterceptar(true);

  const escolherInterceptador = (jog) => {
    setJogadorInterceptador(jog);
    atribuirCarta(jog);
    setMostraInterceptar(false);
    setFase(5);
  };

  return (
    <div className="centralizado" style={{ paddingTop: "1rem", width: "100%" }}>
      <div className="tela-jogo-container">
        {!vencedor &&(<>
            <h1 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
              Vez de: {jogadores[jogadorAtual]?.name || "N/A"}
            </h1>

            {fase === 1 && (
              <button onClick={tirarCarta} className="botao-personalizado">
                Tirar Carta
              </button>
            )}

            {fase === 2 && cartaAtual && (
              <>
                <h2>Símbolo: {cartaAtual.simbolo}</h2>
                <p>{cartaAtual.enunciado}</p>
                <p><strong>Shots: {cartaAtual.shots}</strong></p>
                <h3>Escolha quem vai responder:</h3>
                <div className="flex-horizontal">
                  {jogadores
                    .filter(j => j.name !== jogadores[jogadorAtual].name)
                    .map((j, i) => (
                      <button
                        key={i}
                        onClick={() => escolherJogador(j)}
                        className="botao-personalizado"
                      >
                        {j.name}
                      </button>
                    ))}
                </div>
              </>
            )}

            {fase === 3 && (
              <>
                <h2><strong>{jogadorEscolhido.name}</strong> vai responder.</h2>
                <button onClick={revelarCarta} className="botao-personalizado">Revelar Carta</button>
              </>
            )}

            {fase === 4 && cartaAtual && (
              <>
                <h2><strong>{jogadorEscolhido.name}</strong> responde.</h2>
                <h2>Símbolo: {cartaAtual.simbolo}</h2>
                <p>{cartaAtual.enunciado}</p>
                <p><strong>Shots: {cartaAtual.shots}</strong></p>
                {!mostraInterceptar ? (
                  <>
                    <button onClick={responder} className="botao-personalizado">Responder</button>
                    <button onClick={desistir} className="botao-personalizado">Desistir</button>
                    <button onClick={interceptar} className="botao-personalizado">Interceptar</button>
                  </>
                ) : (
                  <>
                    <h3>Quem interceptou?</h3>
                    <div className="flex-horizontal">
                      {jogadores
                        .filter(j =>
                          j.name !== jogadores[jogadorAtual].name &&
                          j.name !== jogadorEscolhido.name)
                        .map((j, i) => (
                          <button
                            key={i}
                            onClick={() => escolherInterceptador(j)}
                            className="botao-personalizado"
                          >
                            {j.name}
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </>
            )}

            {fase === 5 && (
              <>
                <h2>Carta foi interceptada por: <strong>{jogadorInterceptador.name}</strong></h2>
                <h2>Símbolo: {cartaAtual.simbolo}</h2>
                <p>{cartaAtual.enunciado}</p>
                <p><strong>Shots: {cartaAtual.shots}</strong></p>
                <button onClick={proximaRodada} className="botao-personalizado">Próxima Rodada</button>
              </>
            )}
          </>
        )}

        {vencedor && (
          <div>
            <h2>{vencedor} venceu o jogo!</h2>
            <button onClick={() => setVencedor(null)} className="botao-personalizado">
              Continuar jogando
            </button>
            <button onClick={() => window.location.reload()} className="botao-personalizado">
              Reiniciar jogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
