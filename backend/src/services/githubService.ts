import axios from 'axios';

/**
 * Checks if a given GitHub URL is valid and points to a public repository.
 * @param repoUrl The GitHub repository URL (e.g., https://github.com/facebook/react)
 * @returns {Promise<{ valid: boolean; public: boolean; reason?: string }>} Validation result
 */
export async function validateGithubRepoUrl(repoUrl: string): Promise<{ valid: boolean; public: boolean; reason?: string }> {
  // Basic URL validation
  try {
    const url = new URL(repoUrl);
    if (url.hostname !== 'github.com') {
      return { valid: false, public: false, reason: 'Not a github.com URL' };
    }
    // Expecting /owner/repo structure
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      return { valid: false, public: false, reason: 'URL does not match /owner/repo structure' };
    }
    const [owner, repo] = pathParts;
    // Check repo via GitHub API
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const res = await axios.get(apiUrl, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
      if (res.data.private) {
        return { valid: true, public: false, reason: 'Repository is private' };
      }
      return { valid: true, public: true };
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        return { valid: false, public: false, reason: 'Repository not found' };
      }
      return { valid: false, public: false, reason: 'GitHub API error: ' + err.message };
    }
  } catch (e: any) {
    return { valid: false, public: false, reason: 'Invalid URL: ' + e.message };
  }
}
