const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = 'flowency-live';
const REPO_NAME = 'client-docs';
const API_BASE = 'https://api.github.com';

export interface GitHubFile {
  content: string;
  sha: string;
}

export const githubService = {
  async getFile(clientId: string, filename: string = 'prd.md'): Promise<GitHubFile> {
    const path = `clients/${clientId}/${filename}`;
    const response = await fetch(
      `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Document not found');
      }
      throw new Error('Failed to fetch document');
    }

    const data = await response.json();
    const content = atob(data.content);

    return {
      content,
      sha: data.sha
    };
  },

  async updateFile(
    clientId: string,
    content: string,
    sha: string,
    filename: string = 'prd.md',
    commitMessage: string = 'Update document'
  ): Promise<void> {
    const path = `clients/${clientId}/${filename}`;
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    const response = await fetch(
      `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encodedContent,
          sha
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save document');
    }
  }
};
