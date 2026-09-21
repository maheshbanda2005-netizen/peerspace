import { User, Room, Deck, Resource, Task } from '../types';

export const currentUser: User = {
  id: 'usr_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@berkeley.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'STUDENT',
  studyStreak: 12,
  longestStreak: 18,
  totalFocusMins: 1480,
  level: 14,
  xp: 3450,
  graceDaysLeft: 1,
  university: 'UC Berkeley',
  major: 'Computer Science & AI',
};

export const initialRooms: Room[] = [
  {
    id: 'room_cs101',
    name: 'Distributed Systems & Cloud Architecture',
    description: 'Deep focus study session for CS262A midterm preparation. Camera optional, timer synced.',
    category: 'Computer Science',
    isPrivate: false,
    timerState: {
      duration: 1500,
      timeLeft: 1240,
      status: 'RUNNING',
      mode: 'focus',
      startedAt: Date.now() - 260000,
    },
    bgSound: 'rain',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'mem_1',
        userId: 'usr_01',
        name: 'Alex Rivera',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'focusing',
        currentTask: 'Raft Consensus Algorithm notes',
        joinedAt: '15m ago',
        isHost: true,
      },
      {
        id: 'mem_2',
        userId: 'usr_02',
        name: 'Marcus Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'focusing',
        currentTask: 'Kubernetes Pod Lifecycle & CRD diagram',
        joinedAt: '35m ago',
        isHost: false,
      },
      {
        id: 'mem_3',
        userId: 'usr_03',
        name: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        status: 'focusing',
        currentTask: 'Paxos vs Two-Phase Commit analysis',
        joinedAt: '42m ago',
        isHost: false,
      },
      {
        id: 'mem_4',
        userId: 'usr_04',
        name: 'Devon Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        status: 'break',
        currentTask: 'Grabbing matcha tea 🍵',
        joinedAt: '1h ago',
        isHost: false,
      }
    ]
  },
  {
    id: 'room_ai202',
    name: 'Neural Networks & Deep Learning Sprint',
    description: 'Working through PyTorch Transformer implementation & Backprop derivations.',
    category: 'AI & ML',
    isPrivate: false,
    timerState: {
      duration: 1500,
      timeLeft: 900,
      status: 'RUNNING',
      mode: 'focus',
    },
    bgSound: 'lofi',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'mem_5',
        userId: 'usr_05',
        name: 'Siddharth Nair',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        status: 'focusing',
        currentTask: 'FlashAttention-2 benchmark',
        joinedAt: '20m ago',
        isHost: true,
      },
      {
        id: 'mem_6',
        userId: 'usr_06',
        name: 'Sarah Jenkins',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        status: 'focusing',
        currentTask: 'Attention is All You Need Review',
        joinedAt: '12m ago',
        isHost: false,
      }
    ]
  },
  {
    id: 'room_math301',
    name: 'Calculus III & Linear Algebra Problem Lab',
    description: 'Solving multi-variable integration and vector space proofs quietly together.',
    category: 'Mathematics',
    isPrivate: false,
    timerState: {
      duration: 1500,
      timeLeft: 1500,
      status: 'IDLE',
      mode: 'focus',
    },
    bgSound: 'brownNoise',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'mem_7',
        userId: 'usr_07',
        name: 'Kaito Tanaka',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        status: 'idle',
        currentTask: "Stokes' Theorem proofs",
        joinedAt: '5m ago',
        isHost: true,
      }
    ]
  }
];

export const initialDecks: Deck[] = [
  {
    id: 'deck_algo',
    title: 'Data Structures & Algorithms Mastery',
    description: 'Time complexities, graph traversals, dynamic programming paradigms, and tree rotations.',
    category: 'Computer Science',
    isPublic: true,
    userId: 'usr_01',
    authorName: 'Alex Rivera',
    cardsCount: 6,
    masteryScore: 84,
    color: 'from-violet-600 to-indigo-600',
    createdAt: '2026-08-10',
    cards: [
      {
        id: 'card_1',
        front: 'What is the amortized time complexity of inserting an element into a dynamic array (like std::vector or ArrayList)?',
        back: 'O(1) amortized. When the array reaches capacity, it doubles size (costing O(N)), but because doubling occurs exponentially rarely, the average cost per insertion remains constant O(1).',
        deckId: 'deck_algo',
        interval: 6,
        repetitions: 2,
        easeFactor: 2.5,
        nextReviewAt: new Date(Date.now() - 1000).toISOString(),
      },
      {
        id: 'card_2',
        front: 'Explain the difference between Dijkstra’s algorithm and Bellman-Ford.',
        back: '• Dijkstra: Greedy algorithm for Single-Source Shortest Path. Time complexity O((V+E) log V) with min-heap. Does NOT work with negative edge weights.\n• Bellman-Ford: Dynamic programming approach. Time complexity O(V × E). Works with negative edge weights and can detect negative cycles.',
        deckId: 'deck_algo',
        interval: 3,
        repetitions: 1,
        easeFactor: 2.4,
        nextReviewAt: new Date(Date.now() - 2000).toISOString(),
      },
      {
        id: 'card_3',
        front: 'What is the Master Theorem formula for divide-and-conquer recurrences: T(n) = a T(n/b) + f(n)?',
        back: 'Compare f(n) with n^(log_b a):\n1. If f(n) = O(n^(log_b a - ε)) => T(n) = Θ(n^(log_b a))\n2. If f(n) = Θ(n^(log_b a) * log^k n) => T(n) = Θ(n^(log_b a) * log^(k+1) n)\n3. If f(n) = Ω(n^(log_b a + ε)) and regularity condition holds => T(n) = Θ(f(n)).',
        deckId: 'deck_algo',
        interval: 1,
        repetitions: 0,
        easeFactor: 2.3,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_4',
        front: 'What guarantees the height balance in an AVL Tree vs a Red-Black Tree?',
        back: '• AVL Tree: For every node, height difference between left & right subtree is at most 1. More strictly balanced, faster lookups (O(log N)).\n• Red-Black Tree: Max path length is at most 2× min path length using node color properties. Faster insertions and deletions due to fewer rotations.',
        deckId: 'deck_algo',
        interval: 4,
        repetitions: 2,
        easeFactor: 2.6,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_5',
        front: 'How does Tarjan’s Strongly Connected Components (SCC) algorithm work?',
        back: 'Uses a single Depth First Search (DFS). It assigns discovery times (discovery IDs) and low-link values to track the smallest node reachable from a subtree. Nodes are kept on a stack until a root of an SCC is found.',
        deckId: 'deck_algo',
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_6',
        front: 'What is the optimal substructure and state transition for the 0/1 Knapsack problem?',
        back: 'dp[i][w] = max value using first i items and max weight w.\n• If weight[i-1] > w: dp[i][w] = dp[i-1][w]\n• Else: dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i-1]] + value[i-1]).\nSpace optimization: can reduce to 1D array of size W by traversing right to left.',
        deckId: 'deck_algo',
        interval: 6,
        repetitions: 2,
        easeFactor: 2.55,
        nextReviewAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'deck_os',
    title: 'Operating Systems & Concurrency',
    description: 'Semaphores, virtual memory paging, CPU scheduling algorithms, and deadlock conditions.',
    category: 'Computer Science',
    isPublic: true,
    userId: 'usr_02',
    authorName: 'Marcus Chen',
    cardsCount: 4,
    masteryScore: 70,
    color: 'from-emerald-600 to-teal-600',
    createdAt: '2026-08-14',
    cards: [
      {
        id: 'card_os_1',
        front: 'What are the Coffman conditions required for a deadlock to occur?',
        back: 'All 4 conditions must hold simultaneously:\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
        deckId: 'deck_os',
        interval: 2,
        repetitions: 1,
        easeFactor: 2.5,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_os_2',
        front: 'How does Translation Lookaside Buffer (TLB) miss handling differ in hardware vs software?',
        back: '• Hardware-managed TLB (x86): CPU walks page tables in RAM automatically on miss.\n• Software-managed TLB (MIPS/RISC): CPU raises a trap/exception; the OS kernel TLB miss handler loads the entry.',
        deckId: 'deck_os',
        interval: 3,
        repetitions: 1,
        easeFactor: 2.45,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_os_3',
        front: 'What is the ABA problem in lock-free programming, and how is it mitigated?',
        back: 'Occurs in Compare-And-Swap (CAS) when a value changes from A to B and back to A. A thread checking CAS sees A and mistakenly assumes nothing changed.\nMitigation: Version tags / generation counters (e.g. tagged pointers or Hazard Pointers).',
        deckId: 'deck_os',
        interval: 1,
        repetitions: 0,
        easeFactor: 2.2,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_os_4',
        front: 'Compare Copy-On-Write (COW) during fork() with standard process creation.',
        back: 'Instead of duplicating all memory pages upon fork(), parent and child share the same physical pages marked read-only. A private copy of a page is only allocated when either process attempts to write to it.',
        deckId: 'deck_os',
        interval: 4,
        repetitions: 2,
        easeFactor: 2.6,
        nextReviewAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'deck_ai',
    title: 'Transformer Architecture & LLM Foundations',
    description: 'Multi-head self-attention, RoPE embeddings, KV cache mechanics, and RLHF concepts.',
    category: 'AI & ML',
    isPublic: true,
    userId: 'usr_01',
    authorName: 'Alex Rivera',
    cardsCount: 4,
    masteryScore: 92,
    color: 'from-fuchsia-600 to-pink-600',
    createdAt: '2026-08-18',
    cards: [
      {
        id: 'card_ai_1',
        front: 'Write out the Scaled Dot-Product Attention equation and explain why the scaling factor sqrt(d_k) is used.',
        back: 'Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V\n\nWhy sqrt(d_k)? For large d_k, dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients (vanishing gradients). Dividing by sqrt(d_k) maintains unit variance.',
        deckId: 'deck_ai',
        interval: 6,
        repetitions: 3,
        easeFactor: 2.7,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_ai_2',
        front: 'What is the purpose of Key-Value (KV) Caching during LLM autoregressive inference?',
        back: 'During token generation, past tokens do not change. To avoid re-computing Keys and Values for all previous tokens in every forward pass, calculated K & V tensors are cached in GPU memory, reducing computation from O(N^2) to O(N) per step.',
        deckId: 'deck_ai',
        interval: 5,
        repetitions: 2,
        easeFactor: 2.6,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_ai_3',
        front: 'How does Rotary Position Embedding (RoPE) encode relative token distances?',
        back: 'RoPE applies a complex 2D rotation matrix to query and key vectors based on their token index position. The inner product <R_m q, R_n k> depends only on the relative offset (m - n), giving strong length extrapolation and relative positional awareness.',
        deckId: 'deck_ai',
        interval: 6,
        repetitions: 3,
        easeFactor: 2.65,
        nextReviewAt: new Date().toISOString(),
      },
      {
        id: 'card_ai_4',
        front: 'What is FlashAttention and why is it faster without approximating attention?',
        back: 'FlashAttention restructures the attention calculation into tiles that fit entirely inside GPU SRAM (fast on-chip memory). It uses online softmax normalization to avoid writing the full N×N attention matrix to slow High-Bandwidth Memory (HBM).',
        deckId: 'deck_ai',
        interval: 7,
        repetitions: 3,
        easeFactor: 2.8,
        nextReviewAt: new Date().toISOString(),
      }
    ]
  }
];

export const initialResources: Resource[] = [
  {
    id: 'res_01',
    title: 'Distributed Systems Comprehensive Exam Cheat Sheet',
    description: 'Complete 12-page synthesis covering Consensus (Raft, Paxos), Vector Clocks, CAP Theorem, Gossip Protocols, and Fault Tolerance proofs.',
    category: 'Computer Science',
    fileUrl: 'https://example.com/distributed-systems-cheatsheet.pdf',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    tags: ['Distributed Systems', 'Raft', 'Cloud', 'Midterm Prep', 'CS162'],
    upvotes: 248,
    isUpvoted: true,
    downloads: 1420,
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '3 days ago',
    pages: 12,
    contentSnippet: `## Distributed Systems Synthesis Guide

### 1. CAP Theorem & PACELC
- **Consistency**: Every read receives the most recent write or an error.
- **Availability**: Every request receives a non-error response, without guarantee that it contains the most recent write.
- **Partition Tolerance**: The system continues to operate despite an arbitrary number of messages being dropped or delayed.
- **PACELC Extension**: If Partition (P), choose between Availability (A) and Consistency (C); Else (E), choose between Latency (L) and Consistency (C).

### 2. Raft Consensus Summary
- **Leader Election**: Randomized timers (150-300ms) prevent split votes. Candidate requests votes from majority.
- **Log Replication**: Leader forces follower logs to match its own. Uncommitted entries overwritten if divergence occurs.
- **Safety Invariant**: Election rule requires candidate to have an up-to-date log (last term > peer term, or same term with longer index).`
  },
  {
    id: 'res_02',
    title: 'Deep Learning & Transformer Mathematics Reference',
    description: 'Derivations for backpropagation through Multi-Head Attention, Softmax Jacobian, LayerNorm gradients, and FlashAttention IO complexity.',
    category: 'AI & ML',
    fileUrl: 'https://example.com/transformer-math.pdf',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    tags: ['Deep Learning', 'PyTorch', 'Transformers', 'Math', 'LLMs'],
    upvotes: 395,
    isUpvoted: false,
    downloads: 2180,
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '1 week ago',
    pages: 18,
    contentSnippet: `## Transformer Mathematical Foundations

### 1. Multi-Head Self Attention (MHA)
Given input sequence matrix $X \\in \\mathbb{R}^{N \\times d}$, linear projections yield:
$$Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V$$
where $W_Q, W_K, W_V \\in \\mathbb{R}^{d \\times d_k}$.

The scaled dot-product attention score matrix $S$:
$$S = \\frac{Q K^T}{\\sqrt{d_k}} \\in \\mathbb{R}^{N \\times N}$$
Applying Softmax row-wise:
$$A = \\text{softmax}(S), \\quad \\text{Output} = A V$$`
  },
  {
    id: 'res_03',
    title: 'Multivariable Calculus & Differential Forms Quick Guide',
    description: 'Stokes’ Theorem, Green’s Theorem, Divergence Theorem, Line Integrals, and Curvilinear Coordinates visual diagrams.',
    category: 'Mathematics',
    fileUrl: 'https://example.com/calculus-summary.pdf',
    fileSize: '2.1 MB',
    fileType: 'Summary',
    tags: ['Calculus', 'Math', 'Vector Analysis', 'Exams'],
    upvotes: 182,
    isUpvoted: false,
    downloads: 890,
    authorName: 'Kaito Tanaka',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2 weeks ago',
    pages: 8,
    contentSnippet: `## Fundamental Theorems of Vector Calculus

### 1. Green's Theorem in the Plane
Let $C$ be a positively oriented, piecewise smooth, simple closed curve in $\\mathbb{R}^2$ bounding region $D$:
$$\\oint_C (L\\,dx + M\\,dy) = \\iint_D \\left( \\frac{\\partial M}{\\partial x} - \\frac{\\partial L}{\\partial y} \\right) dA$$

### 2. Stokes' Theorem
$$\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$`
  },
  {
    id: 'res_04',
    title: 'Operating Systems Kernel & Memory Management Notes',
    description: 'Virtual Memory, TLB handling, Multi-Level Paging, Linux CFS scheduler, and IPC synchronization primitives.',
    category: 'Computer Science',
    fileUrl: 'https://example.com/os-kernel-notes.pdf',
    fileSize: '5.2 MB',
    fileType: 'Cheatsheet',
    tags: ['Operating Systems', 'Linux', 'Memory', 'C Programming'],
    upvotes: 310,
    isUpvoted: true,
    downloads: 1650,
    authorName: 'Marcus Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '5 days ago',
    pages: 15,
    contentSnippet: `## Virtual Memory Architecture

### 4-Level Paging on x86-64
Virtual Address (48 bits):
- **Bits 47-39**: PML4 Index (9 bits = 512 entries)
- **Bits 38-30**: PDPT Index (9 bits = 512 entries)
- **Bits 29-21**: Page Directory Index (9 bits = 512 entries)
- **Bits 20-12**: Page Table Index (9 bits = 512 entries)
- **Bits 11-0**: Physical Offset (12 bits = 4KB page)`
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Implement Raft Leader Election in Go',
    description: 'Write unit tests for split-vote handling and heartbeat timers in the consensus module.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    category: 'CS262A',
    dueDate: 'Tomorrow, 11:59 PM',
    estimatedMinutes: 90,
    createdAt: '2026-08-22',
  },
  {
    id: 'task_2',
    title: 'Review SM-2 Flashcard Deck: Data Structures',
    description: 'Complete 6 due flashcards on AVL Trees and Graph Theory.',
    status: 'TODO',
    priority: 'HIGH',
    category: 'CS61B',
    dueDate: 'Today, 8:00 PM',
    estimatedMinutes: 20,
    createdAt: '2026-08-24',
  },
  {
    id: 'task_3',
    title: 'Derive FlashAttention-2 Backward Pass Equations',
    description: 'Confirm gradient computations match standard scaled dot product attention.',
    status: 'REVIEW',
    priority: 'MEDIUM',
    category: 'AI / ML',
    dueDate: 'Aug 28',
    estimatedMinutes: 45,
    createdAt: '2026-08-20',
  },
  {
    id: 'task_4',
    title: 'Solve Calculus III Problem Set 7 (Vector Fields)',
    description: 'Problems 14 through 22 on Surface Integrals and Divergence theorem.',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    category: 'MATH 53',
    dueDate: 'Aug 23',
    completedAt: '2026-08-23T14:30:00Z',
    estimatedMinutes: 60,
    createdAt: '2026-08-19',
  },
  {
    id: 'task_5',
    title: 'Read Google Spanner & TrueTime Paper',
    description: 'Annotate sections on GPS/Atomic clock synchronized timestamps and external consistency.',
    status: 'TODO',
    priority: 'LOW',
    category: 'Reading',
    dueDate: 'Aug 30',
    estimatedMinutes: 40,
    createdAt: '2026-08-23',
  }
];
