# lsd-morphing-logo

Logo do Laboratório Analytics. Design feito pelo Datadot estúdio.

A aparência da logo num dado momento é uma função de cinco coisas:

1. Quanto da semana já passou (Fim de semana é um valor mais alto, sábado é o máximo :));
1. Quanto do dia já passou (Noite é um valor mais alto);
1. Quantos commits fizemos nos repositórios da organização `analytics-ufcg` nas últimas 4 semanas;
1. Quantos repositórios na organização `analytics-ufcg` tiveram ao menos um commit nas últimas 4 semanas; e
1. Um número aleatório vindo de uma distribuição log-normal.

Em ordem, esses parâmetros determinam o comprimento de cada uma das cinco retas que saem de uma mesma origem pra desenhar a logo.

Porque gostamos de aleatoriedade, um pequeno erro uniforme é adicionado a cada parâmetro, também.

## Requirements

Install `grunt-cli`, `bower` globally (needs admin privileges):

```
npm install -g grunt-cli bower
```

For the python part:

```
pip install --pre github3.py
```

## Build & development

Primeiro, instale  as dependências do projeto com *npm* and *bower*.

```
npm install
bower install
```
Para gerar a distribuição:

```
grunt build
```

Para visualizar enquanto desenvolve:

```
grunt serve
```

Para realizar deployment no gh-pages:

```
grunt gh-pages
```

## Para pegar as informações do github

```
# Edite o arquivo para colocar sua senha.
python github_stats/githubstats.py
```
