## Requisitos

- Docker 20.10.7, build f0df350 https://www.docker.com/get-started

- Docker compose 1.29.2, build 5becea4c

- NODE JS 15.3.0

---

## Docker

- caso queira trocar os dados de acesso ao Postres é só trocar no arquivo ".env" dentro da pasta Raiz do Projeto antes de inicializar o banco e consequentemente trocar a configuração da api no "ormconfig.json".

- caso queira mudar o ambiente de desenvolvimento para produção mude no arquivo docker-compose.yaml o final da tag entrypoint de "entrypoint-dev.sh" para "entrypoint.sh"

- na pasta Raiz pelo bash/shell e coloque o comando docker-compose up e aguardar.

</br>
</br>

comandos para manipulação de migrations e lint estão no package.json em "scripts", digite "npm run nome_do_script".

</br>

comandos para manipulação do PM2 estão no package.json em "scripts", digite "npm stop" ou "npm restart", para rodar.

</br>

comandos para manipulação do Jest estão no package.json em "scripts", digite "test:unit" para rodar para parar a execução digite "CTRL + C" no terminal.

</br>

## OBS.:

- Para rodar os commandos é necessário ter nodejs instalado em sua máquina ou acessar o container com o commando "docker exec -it postgresDB bash"
- Para rodar a aplicação fora do container é necessário ter node instalado na maquina, modificar o ormconfig.json no campo host seu valor para "localhost", voce terá que rodar o container com postgres apenas, vá na pasta raiz e digite "npm run dev" para rodar em desenvolvimento.
- Para o Eslint funcionar é necessário instalar sua extensão no vscode, para isso acesse "https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint" e adicione o script abaixo ao seu settings.json, para isso no vscode acione o atalho CTRL + SHIFT + P e digite "settings", clique na opção "Preferences: Open Settings (JSON)" e cole o código no JSON.
  </br>
  "editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
  },
  </br>

### Documentação e Consumo

</br>

- para acessar a Documentação feita com Swagger acesse a rota http://localhost:3000/api-docs

- para consumir da aplicação utilize Insomnia (https://insomnia.rest/download) ou Postman(https://www.postman.com/downloads/).
