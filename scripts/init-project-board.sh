#!/usr/bin/env bash
# ------------------------------------------------------------
# init-project-board.sh – crea board “Varcavia Milestones”
# + campo Status (Backlog/In Progress/Done)
# + 4 issue-milestone collegate
# ------------------------------------------------------------
set -euo pipefail

ORG="VARCAVIA-Inc"
REPO="$ORG/varcavia-poc"
PROJECT_NAME="Varcavia Milestones"
MILESTONES=(
  "Milestone 2A – Deploy Flowise"
  "Milestone 2B – Marketplace front-end"
  "Milestone 2C – librarian cron"
  "Milestone 2D – Security hardening"
)

need() { command -v "$1" >/dev/null || { echo "✗ $1 non trovato"; exit 1; } ;}
need gh
need jq

echo "➤ Autenticazione GitHub CLI…"
gh auth status -h github.com >/dev/null || {
  echo "Esegui:  gh auth login --hostname github.com --with-token   # PAT con scope: repo, project"
  exit 1
}

echo "➤ Creazione (o recupero) board “$PROJECT_NAME”…"
ORG_NODE_ID=$(gh api orgs/"$ORG" | jq -r .node_id)

read -r -d '' CREATE_PROJECT <<'GQL'
mutation($org: ID!, $title: String!) {
  createProjectV2(input: {ownerId: $org, title: $title}) {
    projectV2 { id }
  }
}
GQL

# se esiste già con quel titolo, GitHub lancerà errore: gestiamo con || true
PROJECT_ID=$(gh api graphql -f query="$CREATE_PROJECT" -f org="$ORG_NODE_ID" -f title="$PROJECT_NAME" 2>/dev/null \
  | jq -r '.data.createProjectV2.projectV2.id') || true

# fallback: cerca ID di board già esistente
if [[ -z "$PROJECT_ID" || "$PROJECT_ID" == "null" ]]; then
  PROJECT_ID=$(gh api graphql -f query='
    query($org:String!,$title:String!){
      organization(login:$org){
        projectsV2(first:100, query:$title){nodes{id,title}}
      }
    }' -f org="$ORG" -f title="$PROJECT_NAME" \
    | jq -r '.data.organization.projectsV2.nodes[0].id')
fi
echo "   → projectId = $PROJECT_ID"

echo "➤ Campo “Status” + opzioni…"
FIELD_ID=$(gh api graphql -f query='
  mutation($project:ID!){
    addProjectV2Field(input:{
      projectId:$project,
      name:"Status",
      dataType:SINGLE_SELECT
    }){field{id}}
  }' -f project="$PROJECT_ID" 2>/dev/null |
  jq -r '.data.addProjectV2Field.field.id') || true

# se esiste già, recupera l’ID
if [[ -z "$FIELD_ID" || "$FIELD_ID" == "null" ]]; then
  FIELD_ID=$(gh api graphql -f query='
    query($project:ID!){
      node(id:$project){
        ... on ProjectV2{
          fields(first:20){nodes{id,name}}
        }
      }
    }' -f project="$PROJECT_ID" |
    jq -r '.data.node.fields.nodes[] | select(.name=="Status") | .id')
fi

for opt in "Backlog" "In Progress" "Done"; do
  gh api graphql -f query='
    mutation($project:ID!,$field:ID!,$name:String!){
      addProjectV2FieldOption(input:{
        projectId:$project,
        fieldId:$field,
        name:$name
      }){fieldOption{id}}
    }' -f project="$PROJECT_ID" -f field="$FIELD_ID" -f name="$opt" 2>/dev/null || true
done

echo "➤ Seed milestone-issue…"
for title in "${MILESTONES[@]}"; do
  ISSUE_JSON=$(gh issue create -R "$REPO" -t "$title" -l milestone --body "" --json id,number 2>/dev/null) || true
  # se l’issue esiste, recupera ID
  if [[ -z "$ISSUE_JSON" || "$ISSUE_JSON" == "null" ]]; then
    ISSUE_JSON=$(gh api repos/"$REPO"/issues --paginate |
      jq -r --arg t "$title" '.[] | select(.title==$t) | {id:.node_id,number:.number}' | head -n1)
  fi
  ISSUE_ID=$(echo "$ISSUE_JSON" | jq -r .id)
  gh api graphql -f query='
    mutation($projectId:ID!,$contentId:ID!){
      addProjectV2ItemById(input:{
        projectId:$projectId,
        contentId:$contentId
      }){item{id}}
    }' -f projectId="$PROJECT_ID" -f contentId="$ISSUE_ID" 2>/dev/null || true
  echo "   • Issue #$(echo "$ISSUE_JSON" | jq -r .number) collegata"
done

echo "✔ Board pronta ➜ https://github.com/orgs/$ORG/projects"
echo "   Trascina “Milestone 2A – Deploy Flowise” in **In Progress** e procedi col deploy su Render."
