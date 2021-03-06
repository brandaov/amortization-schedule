# Amortization Schedule

> Este programa consome de uma API REST para criar e gerenciar tabelas de amortização PRICE

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [x] Criar e gerenciar tabelas PRICE
- [x] API funcional
- [x] Banco de dados MongoDB
- [ ] Capacidade de alterar taxas e períodos mensais para anuais
- [ ] Testes unitários com jest

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

* Você instalou a versão mais recente de `Node.js` e `MongoDB`.
* Você tem uma máquina `Windows`. **O projeto não foi testado para Ubuntu** porém deve funcionar normalmente 😅

## ☕ Usando amortization-schedule

Para usar amortization-schedule, siga estas etapas:

Windows:
```
Run MongoDB:
mongod --dbpath 'C:\Program Files\MongoDB\Server\5.0\data\db'

Tenha certeza de que os diretórios 'C:\Program Files\MongoDB\Server\5.0\data\' e 
'C:\Program Files\MongoDB\Server\5.0\logs\' tenham permissões de acesso completas. 
```

```
Run Server:
node src\server.js 

```

Para testar as rotas, utilize o arquivo amortization-schedule.postman_collection.json
e carregue-o no POSTMAN.

Rotas:
```
GET: http://localhost:3000/schedules
// retorna todos os Schedules criados
```
```
POST: http://localhost:3000/schedules
// Cria um novo Schedule com base nos atributos 
  1. pv => valor de financiamento ($)
  2. n_periodo => numero de parcelas a serem divididas (meses)
  3. tax => taxa de juros (%)
```
```
DELETE: http://localhost:3000/schedules/:id
// Deleta um Schedule por ID

exemplo de <:id> = <6122a74f92c4b73ad85dde43>
```
```
PUT: http://localhost:3000/schedules/:id

 Renegocia um Schedule existente com base no numero de um mês, 
 passado pelo body da requisição, que o cliente não conseguiu
 pagar e o atualiza com os novos valores

exemplo de <:id> = <6122a74f92c4b73ad85dde43>
```

## 📫 Contribuindo para amortization-schedule

Para contribuir com amortization-schedule, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin amortization-schedule / <local>`
5. Crie a solicitação de pull.

Como alternativa, consulte a documentação do GitHub em [como criar uma solicitação pull]
(https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 🤝 Colaboradores

Criador do projeto

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/43972105?s=400&u=ac714bc3975a25923e5150136f472f41e1d89be9&v=4" width="100px;" alt="Foto de Victor Brandão no Github"/><br>
        <sub>
          <b>Victor L. Brandão</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## 📝 Licença

Livre para usar como quiser! 😉

[⬆ Voltar ao topo](amortization-schedule)<br>