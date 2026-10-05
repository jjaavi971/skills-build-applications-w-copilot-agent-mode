const codespaceName = process.env.CODESPACE_NAME

const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export default apiUrl