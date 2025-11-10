const API_BASE_URL = 'https://api.bndy.co.uk';

export const apiService = {
  async validateInvite(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/flowency-invites/${token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Invite not found or expired');
    }

    return response.json();
  }
};
