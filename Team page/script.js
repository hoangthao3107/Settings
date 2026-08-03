const teamData = {
  "bug-bash": {
    name: "Bug Bash Workflows Team",
    summary: "Focused team for workflow quality reviews.",
    members: 7,
    admins: 1,
    resources: 3,
    defaultView: "team-members",
    rows: [
      ["Angela Miller", "angela@outmarket.ai", "Admin", "03/03/2026"],
      ["Drew Patel", "drew@outmarket.ai", "Member", "08/03/2026"],
      ["Mina Lee", "mina@outmarket.ai", "Member", "11/03/2026"],
    ],
  },
  collab: {
    name: "Collab Team",
    summary: "Cross-functional team for shared delivery work.",
    members: 14,
    admins: 2,
    resources: 1,
    defaultView: "team-members",
    rows: [
      ["Amey Jain", "amey@outmarket.ai", "Admin", "09/03/2026"],
      ["Ujjwal", "ujjwal@outmarket.ai", "Admin", "16/03/2026"],
      ["Akash", "akash@outmarket.ai", "Member", "09/03/2026"],
      ["Amey", "amey+test2@outmarket.ai", "Member", "10/04/2026"],
      ["Anshu", "anshu@outmarket.ai", "Member", "09/03/2026"],
      ["Dishant Padalia", "dishant@outmarket.ai", "Member", "09/03/2026"],
      ["Eapen", "eapen@outmarket.ai", "Member", "09/03/2026"],
      ["Farhan K", "farhan@outmarket.ai", "Member", "09/03/2026"],
    ],
  },
  "team-test": {
    name: "Team Test",
    summary: "Sandbox team used for validation and QA checks.",
    members: 2,
    admins: 1,
    resources: 1,
    defaultView: "team-members",
    rows: [
      ["Test User", "test@outmarket.ai", "Admin", "05/04/2026"],
      ["QA User", "qa@outmarket.ai", "Member", "06/04/2026"],
    ],
  },
  "all-members": {
    name: "All Members",
    summary: "System team containing all members of the instance",
    members: 303,
    admins: 40,
    resources: 59,
    defaultView: "resource-tree",
    rows: [
      ["Angela Petrone", "angela@outmarket.ai", "Admin", "07/01/2026"],
      ["Anshu", "anshu@outmarket.ai", "Admin", "11/11/2025"],
      ["Anurag", "anurag@outmarket.ai", "Admin", "31/03/2026"],
      ["Amey Jain", "amey@outmarket.ai", "Admin", "01/05/2026"],
      ["Akash", "akash@outmarket.ai", "Admin", "11/11/2025"],
    ],
  },
}

const resourceTreeHtml = `
  <div class="teams-settings__resource-list">
    <section class="teams-settings__resource-group">
      <header class="teams-settings__resource-group-head">
        <div class="teams-settings__resource-group-label">
          <span class="icon icon--folder tab purple"></span>
          <div>
            <div class="teams-settings__resource-group-title">Workflow Management</div>
            <div class="teams-settings__resource-group-subtitle">57 / 79 resources accessible</div>
          </div>
        </div>
        <div class="teams-settings__resource-group-right">
          <span class="teams-settings__count-pill">79</span>
          <span class="icon icon--chevron-down small"></span>
        </div>
      </header>
      <div class="teams-settings__resource-group-body">
        <div class="teams-settings__tree-line"></div>
        ${[
          ["Commercial Insurance", "41/62", "expand"],
          ["Market", "", "toggle"],
          ["Assistant", "", "toggle"],
          ["Proposals", "3/3", "expand"],
          ["Employee Benefits", "4/5", "expand"],
          ["Policy Check", "", "toggle"],
          ["Personal Lines", "6/6", "expand"],
        ]
          .map(
            ([name, detail, mode]) => `
          <div class="teams-settings__tree-row">
            <div class="teams-settings__tree-label">
              <span class="icon icon--folder tab"></span>
              <div class="teams-settings__tree-text">
                <span>${name}</span>
                ${detail ? `<em>${detail}</em>` : ""}
              </div>
            </div>
            ${
              mode === "toggle"
                ? '<span class="teams-settings__toggle is-on"><span class="teams-settings__toggle-knob"></span></span>'
                : '<span class="icon icon--chevron-right small"></span>'
            }
          </div>`,
          )
          .join("")}
      </div>
    </section>
    <section class="teams-settings__resource-group">
      <header class="teams-settings__resource-group-head">
        <div class="teams-settings__resource-group-label">
          <span class="icon icon--proposal purple"></span>
          <div>
            <div class="teams-settings__resource-group-title">Extraction</div>
            <div class="teams-settings__resource-group-subtitle">1 / 1 resources accessible</div>
          </div>
        </div>
        <div class="teams-settings__resource-group-right">
          <span class="teams-settings__count-pill">1</span>
          <span class="icon icon--chevron-down small"></span>
        </div>
      </header>
      <div class="teams-settings__resource-group-body">
        <div class="teams-settings__tree-line"></div>
        <div class="teams-settings__tree-row">
          <div class="teams-settings__tree-label">
            <span class="icon icon--proposal"></span>
            <div class="teams-settings__tree-text">
              <span>Loss Runs</span>
            </div>
          </div>
          <span class="teams-settings__toggle is-on"><span class="teams-settings__toggle-knob"></span></span>
        </div>
      </div>
    </section>
  </div>
`

const resourcesHtml = `
  <div class="teams-settings__resource-cards">
    <div class="teams-settings__resource-card">
      <div class="teams-settings__resource-card-title">Commercial Insurance</div>
      <div class="teams-settings__resource-card-meta">41 of 62 resources shared with this team</div>
    </div>
    <div class="teams-settings__resource-card">
      <div class="teams-settings__resource-card-title">Policy Check</div>
      <div class="teams-settings__resource-card-meta">Automated checks enabled for all members</div>
    </div>
    <div class="teams-settings__resource-card">
      <div class="teams-settings__resource-card-title">Extraction</div>
      <div class="teams-settings__resource-card-meta">1 active resource with organization-wide visibility</div>
    </div>
  </div>
`

const content = document.getElementById("content")
const detailContent = document.getElementById("detail-content")
const teamTitle = document.getElementById("team-title")
const teamSummary = document.getElementById("team-summary")
const membersCount = document.getElementById("members-count")
const adminsCount = document.getElementById("admins-count")
const membersPill = document.getElementById("members-pill")
const resourcesPill = document.getElementById("resources-pill")
const teamCards = Array.from(document.querySelectorAll("[data-team]"))
const tabs = Array.from(document.querySelectorAll("[data-view]"))
const modalLayer = document.getElementById("modal-layer")
const openModal = document.getElementById("open-modal")
const closeModal = document.getElementById("close-modal")

let selectedTeam = "collab"
let activeView = "team-members"

function renderMembersTable(rows) {
  return `
    <label class="teams-settings__search teams-settings__search--members">
      <span class="icon icon--search"></span>
      <input type="text" placeholder="Search members" />
    </label>
    <div class="teams-settings__table-wrap">
      <table class="teams-settings__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([name, email, role, joined]) => `
            <tr>
              <td class="teams-settings__name-cell">${name}</td>
              <td>${email}</td>
              <td>
                <span class="teams-settings__role-pill">
                  <span>${role}</span>
                  <span class="icon icon--chevron-down small"></span>
                </span>
              </td>
              <td>${joined}</td>
              <td class="teams-settings__kebab-cell"><span class="icon icon--more small"></span></td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
}

function renderView() {
  const team = teamData[selectedTeam]

  teamTitle.textContent = team.name
  teamSummary.textContent = team.summary
  membersCount.textContent = String(team.members)
  adminsCount.textContent = String(team.admins)
  membersPill.textContent = String(team.members)
  resourcesPill.textContent = String(team.resources)

  teamCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.team === selectedTeam)
  })

  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === activeView)
  })

  if (activeView === "team-members") {
    detailContent.innerHTML = renderMembersTable(team.rows)
    return
  }

  if (activeView === "resources") {
    detailContent.innerHTML = resourcesHtml
    return
  }

  detailContent.innerHTML = resourceTreeHtml
}

teamCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedTeam = card.dataset.team
    activeView = teamData[selectedTeam].defaultView
    renderView()
  })
})

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeView = tab.dataset.view
    renderView()
  })
})

openModal.addEventListener("click", () => {
  modalLayer.classList.remove("hidden")
  content.classList.add("is-dimmed")
})

closeModal.addEventListener("click", () => {
  modalLayer.classList.add("hidden")
  content.classList.remove("is-dimmed")
})

modalLayer.addEventListener("click", (event) => {
  if (event.target === modalLayer) {
    modalLayer.classList.add("hidden")
    content.classList.remove("is-dimmed")
  }
})

renderView()
