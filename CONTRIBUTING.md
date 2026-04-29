# Guia de Contribuição

Obrigado por contribuir com o **my-finances**! Este documento descreve o fluxo de trabalho que usamos para issues, branches, commits e pull requests.

> Em caso de dúvida, abra uma issue ou pergunte no PR. Prefira sempre **clareza** sobre rigidez.

---

## Sumário

- [Fluxo geral](#fluxo-geral)
- [Estrutura de branches](#estrutura-de-branches)
- [Padrão de issues](#padrão-de-issues)
- [Padrão de branches de trabalho](#padrão-de-branches-de-trabalho)
- [Padrão de commits](#padrão-de-commits)
- [Padrão de Pull Requests](#padrão-de-pull-requests)
- [Promoção entre ambientes](#promoção-entre-ambientes)
- [Setup local](#setup-local)

---

## Fluxo geral

```
issue  →  branch (a partir de develop)  →  commits  →  PR para develop  →  review  →  merge
                                                                                       │
                                                                                       ▼
                                                                       develop → staging → main
```

1. Toda mudança começa em uma **issue**.
2. Cada issue gera **uma branch dedicada**, criada a partir de `develop`.
3. Os commits seguem **Conventional Commits**.
4. O trabalho volta para `develop` via **Pull Request** (com `Closes #N` para fechar a issue).
5. A promoção `develop → staging → main` é feita via PR quando a release é fechada.

---

## Estrutura de branches

| Branch     | Propósito                                    | Recebe merge de       |
| ---------- | -------------------------------------------- | --------------------- |
| `main`     | Código em **produção**                       | `staging`             |
| `staging`  | Código em **homologação** / pré-produção     | `develop`             |
| `develop`  | Integração contínua de features              | `feature/*`, `fix/*`… |
| `feature/*`, `fix/*`, etc. | Trabalho do dia a dia          | —                     |

- **Nunca** comite direto em `main`, `staging` ou `develop`.
- Branches de trabalho são **descartáveis** e devem ser deletadas após o merge.

---

## Padrão de issues

Use os templates disponíveis em `.github/ISSUE_TEMPLATE/`:

- **Bug report** — algo está quebrado.
- **Feature request** — nova funcionalidade ou melhoria.
- **Refactor / Chore** — melhoria interna sem mudança de comportamento.

Boas práticas:

- Título no **imperativo e curto**: _"Permitir filtrar transações por categoria"_.
- Descreva o **comportamento esperado** e, no caso de bug, o **passo a passo para reproduzir**.
- Adicione **labels** (`bug`, `enhancement`, `refactor`, `docs`, `good first issue`…).
- Atribua a issue a alguém antes de começar a trabalhar (`Assignees`).

---

## Padrão de branches de trabalho

Formato:

```
<tipo>/<número-issue>-<descrição-curta-em-kebab-case>
```

**Tipos permitidos** (mesmos do Conventional Commits):

| Tipo       | Quando usar                                                  |
| ---------- | ------------------------------------------------------------ |
| `feat`     | Nova funcionalidade visível para o usuário                   |
| `fix`      | Correção de bug                                              |
| `refactor` | Mudança interna sem alterar comportamento                    |
| `chore`    | Tarefas de manutenção (deps, configs, scripts)               |
| `docs`     | Apenas documentação                                          |
| `test`     | Adicionar ou corrigir testes                                 |
| `perf`     | Melhoria de performance                                      |
| `style`    | Formatação, espaços em branco, lint (sem mudança lógica)     |

**Exemplos:**

```
feat/12-dark-mode-toggle
fix/27-saldo-negativo-no-dashboard
refactor/31-extrair-store-categorias
chore/40-atualiza-deps-nuxt
```

> Sempre criadas a partir de `develop` atualizada:
>
> ```bash
> git checkout develop
> git pull
> git checkout -b feat/12-dark-mode-toggle
> ```

---

## Padrão de commits

Seguimos a especificação [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

Formato:

```
<tipo>(<escopo opcional>): <descrição curta no imperativo>

[corpo opcional explicando o porquê da mudança]

[rodapé opcional, ex.: Refs #12, BREAKING CHANGE: ...]
```

**Regras:**

- Mensagem **em inglês**, no **imperativo** ("add", não "added"/"adds").
- Primeira linha com no máximo ~72 caracteres.
- Um commit deve representar **uma mudança coerente**. Evite commits "wip" misturando coisas.
- Se ajudar, referencie a issue no rodapé: `Refs #12`.

**Exemplos:**

```
feat(dashboard): add category filter to transactions list

fix(auth): prevent logout when refresh token is still valid

refactor(stores): extract category fetching into composable

chore(deps): bump nuxt to 3.13
```

---

## Padrão de Pull Requests

1. **Base do PR**: sempre `develop` (a menos que seja uma promoção entre ambientes).
2. **Título do PR**: mesmo padrão de Conventional Commits, ex.: `feat(dashboard): add category filter`.
3. **Descrição**: use o template (`.github/pull_request_template.md`). Sempre contendo:
   - O que muda e **por quê**.
   - Como testar.
   - `Closes #N` para fechar a issue automaticamente no merge.
4. **Checklist** antes de pedir review:
   - [ ] Branch atualizada com `develop` (`git pull --rebase origin develop`).
   - [ ] Sem `console.log`, código comentado ou arquivos não relacionados.
   - [ ] App roda localmente (`pnpm dev`) sem warnings novos.
   - [ ] Migrations/Supabase aplicadas, se houver.
5. **Review**: pelo menos 1 aprovação antes do merge (quando houver outro contribuidor).
6. **Merge**: prefira **Squash and merge** para manter o histórico de `develop` linear e legível.
7. **Após o merge**: delete a branch remota (o GitHub pode fazer isso automaticamente).

---

## Promoção entre ambientes

Quando uma "release" estiver pronta:

1. Abra um PR de `develop` → `staging`. Título sugerido: `chore(release): promote develop to staging`.
2. Após validação em homologação, abra um PR de `staging` → `main`. Título: `chore(release): promote staging to main`.
3. Crie uma **tag** após o merge em `main`, seguindo [SemVer](https://semver.org/lang/pt-BR/):
   ```bash
   git checkout main && git pull
   git tag -a v0.3.0 -m "v0.3.0"
   git push origin v0.3.0
   ```

---

## Setup local

Veja o [README](./README.md) para instalar dependências e rodar o projeto. Resumo:

```bash
pnpm install
pnpm dev
```
