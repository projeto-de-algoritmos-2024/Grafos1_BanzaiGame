# Grafos1_BanzaiGame

_Número da lista:_ 10
_Conteúdo da disciplina:_ Grafos 1

## Alunos

| Matrícula  | Aluno                       |
| ---------- | --------------------------- |
| 21/1039484 | Iago Rocha Santos Marques   |
| 22/1007920 | Caio Felipe Rocha Rodrigues |

## Sobre

Neste projeto de Grafos 1 implementamos um jogo multiplayer (2 jogadores) local onde os dois player se revezam em turnos para colorir um grid, no início de cada turno o jogador recebe uma quantidade aleatória de movimentos que pode usar para colorir uma célula do grid ainda não preenchida, toda vez que um jogador fecha uma área com sua cor todas as céulas não coloridas contidas nessa área são coloridas com sua respecitva cor.

O projeto foi fortemente inspirado no minigame "banzai" do habboo hotel.

## Screenshot

Examplo de partida :

![Partida](./media/match-example.gif)

## Uso

Com o Node instalado, e estando na raiz do projeto execute :

```sh
npx http-server ./src/
```

Acesse o endereço e porta fornecidos e divirta-se !

## Executando em modo desenvolvimento

### Habilitando tailwind

Certifique-se de possuir o tailwind instalado de acordo com a [documentação](https://tailwindcss.com/docs/installation).

Depois execute os seguinte comando para gerar o CSS a medida em que o código fonte for alterado.

`sh
npx tailwindcss -i ./src/style.css -o ./src/output.css --watch
`
