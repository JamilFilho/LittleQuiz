# LittleQuiz
O LittleQuiz é um quiz de perguntas bíblicas desenvolvido para o projeto [Little Son](https://littleson.com.br) a partir do QuizGames desenvolvido por [Giordane Oliveira](https://github.com/devgiordane).

# Como ajudar?
Se você tem interesse em contribuir no desenvolvimento do projeto há duas maneiras de auxiliar:

## Implementando o Código
Você pode contribuir com o projeto #LittleQuiz adicionando novas funcionalidades ao jogo. Para isso dê uma conferida nos issues e veja algumas funcionalidades a serem adicionadas e bugs a serem corrigidos.

## Adicionando Novas Perguntas
Você também pode adicionar novas perguntas ao #LittleQuiz. Para isso basta editar o arquivo `data/questions.json`.

O arquivo possuí a seguinte estrutura:

```
{
    "title": "Qual foi o primeiro milagre de Jesus?",
    "op1": "Multiplicação dos pães",
    "op2": "Cura do cego de Jericó",
    "op3": "Transformou água em vinho",
    "op4": "Ressuscitou Lázaro",
    "ans": 3,
    "hard": 1
  }
```
`title`: é o enunciado da questão

`op1`: é a opção disponível para resposta. Obrigatóriamente deve haver 4 opções

`ans`: indica qual é a resposta correta. Deve ser indicado como um número inteiro, sem aspas.

`hard`: indica o nível de dificuldade da questão, necessário para definir o tempo para resposta. Deve ser preenchido com um número inteiro de 1 à 4, sendo 1 uma pergunta extremamente fácil e 4 uma pergunta extremamente difícil.
