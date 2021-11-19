# [DRAFT] Relations list

## Onchain/Blockchain:

### Implementations:

- Graphane (legacy)
- Substarte (actual)

### Write:

- Operations\Extrinsics
- Transactions

### Read:

- RPC

### OnchainEntities\DomainEntites:

- Account
- Project
- ProjectContent
- Domain
- Review
- ReviewUpvote
- Asset
- InvestmentOpportunity
- InvestmentOpportunityParticipation
- ContractAgreement
- NonDisclosureAgreement
- Proposal

### Notifications:

- Event-Proxy

## Offchain/Server:

### Implementations:

- Nodejs Web Server

### Write:

- Messages (JsonMsg, FormDataMsg)
- Commands (AppCommands\OffchainCommands, ProtocolCommands\OnchainCommands, TransactionsBuilder\OnchainCommandsBuilder)

### Read:

- Queries

### OffchainEntities\ReadModels:

#### Have Onchain Relations:

| Entity | Onchain Read model | Has a module | Can be (example) |
| :--- | :--- | :---: | :--- |
| User | Account | @deip/users-module | user, student, investor, author |
| Team | Account | @deip/teams-module | abstract team, research group, bootcamp |
| Tenant | Account | @deip/tenants-module | portal, web3Application, network gateway |
| Project | Project | @deip/projects-module | research, technology, music album, library |
| ProjectContent | ProjectContent | ❌ | research/technology content, library item |
| Domain | Domain | ❌ | domain, discipline, global category, department |
| Review | Review | ❌ | project/content/research/technology review |
| ReviewUpvote | ReviewUpvote | ❌ | vote for review |
| Asset | Asset | @deip/assets-module | asset, token, FNFT, Coin |
| InvestmentOpportunity | InvestmentOpportunity | @deip/investment-module | project/research/technology token sale |
| InvestmentOpportunityParticipation | InvestmentOpportunityParticipation | @deip/investment-module | investment, contribution |
| ContractAgreement | ContractAgreement | @deip/contract-agreements-module | technology license, income share agreement, general agreement |
| NonDisclosureAgreement | NonDisclosureAgreement | ❌ | non disclosure agreement |
| Proposal | Proposal | ❌ | proposal, onchain contract, smart contract |

#### Have no Onchain Relations [in progress]:

| Entity | Description |
| :--- | :--- |
| Settings | a set of setting for Tenant\Portal |
| UserRole | enables\disables specific UI blocks, access control |
| ReviewRequest | request for Review |
| UserInvitation | invitation User to a Team |
| Attributes | set of additional data for entities model such as project, team, user |
| DocumentTemplate | templates for documents/contracts |
| Bookmark | bookmarks system^ at this time supports only projects |
| Layout | layouts system, allow change page views in admin section |

#### Notifications:

- Long-Polling
- WebSockets in TODO after migration to Substrate
