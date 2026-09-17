const formulario = document.querySelector("#quiz-form");
const perguntas = [...document.querySelectorAll(".pergunta")];
const resultado = document.querySelector("#resultado");
const baixar = document.querySelector("#baixar");

function avaliar() {
	const escolhidas = perguntas.map((pergunta) => pergunta.querySelector("input:checked"));
	const respondidas = escolhidas.filter(Boolean).length;

	perguntas.forEach((pergunta) => {
		pergunta.querySelectorAll("label").forEach((label) => label.classList.remove("correta", "errada"));
	});

	if (respondidas < perguntas.length) {
		baixar.disabled = true;
		resultado.textContent = `${respondidas} de ${perguntas.length} perguntas respondidas.`;
		resultado.className = "resultado";
		return { escolhidas, pontos: 0 };
	}

	const pontos = escolhidas.reduce((total, escolhida, indice) => {
		const correta = perguntas[indice].querySelector("input[data-correta]");
		const acertou = escolhida === correta;
		escolhida.closest("label").classList.add(acertou ? "correta" : "errada");
		return total + (acertou ? 1 : 0);
	}, 0);

	baixar.disabled = false;
	resultado.textContent = `Pontuação final: ${pontos} de ${perguntas.length}`;
	resultado.className = pontos === perguntas.length ? "resultado sucesso" : "resultado erro";
	return { escolhidas, pontos };
}

formulario.addEventListener("change", avaliar);
formulario.addEventListener("submit", (evento) => {
	evento.preventDefault();
	const { escolhidas, pontos } = avaliar();
	const linhas = ["RESULTADO DO QUIZ", "=================", ""];

	perguntas.forEach((pergunta, indice) => {
		const escolhida = escolhidas[indice];
		const correta = pergunta.querySelector("input[data-correta]");
		const acertou = escolhida === correta;
		linhas.push(`${indice + 1}. ${pergunta.querySelector("th[scope=\"row\"]").textContent}`);
		linhas.push(`Resposta: ${escolhida.value}`);
		linhas.push(`Resultado: ${acertou ? "Correta" : `Errada (correta: ${correta.value})`}`);
		linhas.push("");
	});

	linhas.push(`Pontuação: ${pontos}/${perguntas.length}`);
	const arquivo = new Blob([linhas.join("\n")], { type: "text/plain;charset=utf-8" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(arquivo);
	link.download = "respostas-quiz.txt";
	link.click();
	URL.revokeObjectURL(link.href);
	resultado.textContent = `Arquivo baixado! Você acertou ${pontos} de ${perguntas.length}.`;
	resultado.className = pontos === perguntas.length ? "resultado sucesso" : "resultado erro";
});
