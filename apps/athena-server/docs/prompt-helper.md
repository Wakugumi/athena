# What is this
Helpful for prompting public AI agent for context

# The context

- we are a digital note marketplace where user can buy and sell digital notes.
- Notes are markdown saved in database, they are personal to user, but they will act as item for Listing which is the model shared for sell
- we also provide an in-house editor app for note-taking app. Here when they insert attachments, this is where upload happening.
- In the marketplace website, user can directly create a new Listing by uploading their note as photo. Now this is where upload happening too, but this has more flow, after the upload, a new Note is created in their personal Note, with the image(s) they upload as attachments inside the markdown content, rendering to full page.
- When people download Note, the attachments is rendered as encoded image in the markdown
- App Structure:
  - core: core business domains (user, note, market, ledger, wallet, agent)
  - engine: infrastructure modules (auth, config service, access control, storage)
