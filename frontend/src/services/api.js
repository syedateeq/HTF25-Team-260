// Enhanced Mock data
const mockUsers = [
  { id: 1, username: 'john_doe', email: 'john@example.com' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com' },
  { id: 3, username: 'alex_wong', email: 'alex@example.com' }
];

let mockClaims = [
  {
    id: 1,
    text: 'Scientists have discovered a new planet that could support life in the Kepler-186 system',
    sourceUrl: 'https://nasa.gov/news/kepler-186f',
    userId: 1,
    username: 'john_doe',
    tags: ['Science', 'Space', 'Discovery'],
    createdAt: new Date('2024-01-15'),
    upvotes: 15,
    downvotes: 2,
    credibilityScore: 13,
    status: 'verified'
  },
  {
    id: 2,
    text: 'Drinking coffee prevents all types of cancer according to new study',
    sourceUrl: 'https://healthnews.com/coffee-cancer',
    userId: 2,
    username: 'jane_smith',
    tags: ['Health', 'Nutrition', 'Cancer'],
    createdAt: new Date('2024-01-14'),
    upvotes: 3,
    downvotes: 12,
    credibilityScore: -9,
    status: 'disputed'
  },
  {
    id: 3,
    text: 'Breaking: Major breakthrough in quantum computing achieves quantum supremacy',
    sourceUrl: 'https://technews.com/quantum-breakthrough',
    userId: 3,
    username: 'alex_wong',
    tags: ['Technology', 'Quantum', 'Computing'],
    createdAt: new Date('2024-01-16'),
    upvotes: 8,
    downvotes: 1,
    credibilityScore: 7,
    status: 'pending'
  }
];

let mockComments = [
  {
    id: 1,
    claimId: 1,
    userId: 2,
    username: 'jane_smith',
    text: 'This appears to be from NASA\'s official website. The Kepler-186f discovery is well-documented and peer-reviewed.',
    createdAt: new Date('2024-01-15'),
    isEvidence: true
  },
  {
    id: 2,
    claimId: 2,
    userId: 1,
    username: 'john_doe',
    text: 'This claim is exaggerated. While some studies show coffee may reduce risk of certain cancers, it does not prevent all types. Source: American Cancer Society.',
    createdAt: new Date('2024-01-14'),
    isEvidence: true
  },
  {
    id: 3,
    claimId: 3,
    userId: 2,
    username: 'jane_smith',
    text: 'Need more sources on this. Which research institution published these findings?',
    createdAt: new Date('2024-01-16'),
    isEvidence: false
  }
];

// Simulate API calls with timeouts
export const api = {
  // Auth simulation
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  register: async (username, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const existingUser = mockUsers.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }
    
    const newUser = {
      id: mockUsers.length + 1,
      username,
      email
    };
    mockUsers.push(newUser);
    return { success: true, user: newUser };
  },

  // Claims
  getClaims: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockClaims.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getClaim: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const claim = mockClaims.find(c => c.id === parseInt(id));
    const claimComments = mockComments.filter(c => c.claimId === parseInt(id));
    return { claim, comments: claimComments };
  },

  createClaim: async (claimData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newClaim = {
      id: mockClaims.length + 1,
      ...claimData,
      username: 'current_user',
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      credibilityScore: 0,
      status: 'pending'
    };
    mockClaims.unshift(newClaim);
    return newClaim;
  },

  vote: async (claimId, voteType) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const claim = mockClaims.find(c => c.id === claimId);
    if (voteType === 'upvote') {
      claim.upvotes++;
    } else {
      claim.downvotes++;
    }
    claim.credibilityScore = claim.upvotes - claim.downvotes;
    
    // Auto-update status based on score
    if (claim.credibilityScore > 10) claim.status = 'verified';
    else if (claim.credibilityScore < -5) claim.status = 'disputed';
    else claim.status = 'pending';
    
    return claim;
  },

  addComment: async (claimId, text) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newComment = {
      id: mockComments.length + 1,
      claimId,
      userId: mockUsers[0].id, // Mock user ID
      username: mockUsers[0].username,
      text,
      createdAt: new Date(),
      isEvidence: true
    };
    mockComments.push(newComment);
    return newComment;
  }
};