# Grafos1_BanzaiGame

## Executando em modo desenvolvimento

### Habilitando tailwind

Certifique-se de possuir o tailwind instalado de acordo com a [documentação](https://tailwindcss.com/docs/installation).

Depois execute os seguinte comando para gerar o CSS a medida em que o código fonte for alterado.

``sh
npx tailwindcss -i ./src/style.css -o ./src/output.css --watch
``