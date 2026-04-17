# Groupify API Types - Export for React Native

This document contains all TypeScript interfaces and types used in the Groupify API, ready for React Native implementation.

---

## Base Types

### ApiResponse
```typescript
type ApiResponse<T> = {
  data: T;
  message?: string;
};
```

### ApiError
```typescript
type ApiError = {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
};
```

### Pagination
```typescript
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  next?: string | null;
  previous?: string | null;
}
```

---

## Authentication Types

### LoginCredentials
```typescript
type LoginCredentials = {
  email: string;
  password: string;
};
```

### RegisterCredentials
```typescript
type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  encryptedPassword: string;
};
```

### LoginResponse
```typescript
type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
};
```

### RegisterResponse
```typescript
type RegisterResponse = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  message: string;
};
```

### ForgotPasswordRequest
```typescript
type ForgotPasswordRequest = {
  email: string;
  encrypted_password: string;
};
```

### ForgotPasswordResponse
```typescript
type ForgotPasswordResponse = {
  message: string;
  success: boolean;
};
```

### SubscriptionConfirmRequest
```typescript
type SubscriptionConfirmRequest = {
  token: string;
};
```

### SubscriptionConfirmResponse
```typescript
type SubscriptionConfirmResponse = {
  success: boolean;
  message: string;
};
```

### DeleteAccountResponse
```typescript
type DeleteAccountResponse = {
  success: boolean;
};
```

### UpdatePasswordRequest
```typescript
type UpdatePasswordRequest = {
  password: string;
  passwordConfirmation: string;
};
```

### UpdatePasswordResponse
```typescript
type UpdatePasswordResponse = {
  success: boolean;
};
```

---

## User Types

### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  planName: string;
  maxChannels: number;
  maxGroups: number;
  canCreateSubgroups: boolean;
  priceMonthly: number;
  priceYearly: number;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  groupCount: number;
  channelCount: number;
  canAddChannel: boolean;
  canAddGroup: boolean;
}
```

---

## Group Types

### Group
```typescript
interface Group {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  channels?: Channel[];
  category?: string;
  nestingLevel?: number;
  displayOrder?: number;
  parentId?: string | null;
  enableGroupshelf?: boolean;
  createdAt: string;
  channelCount: number;
  videoCount?: number;
  updatedAt: string;
}
```

### GroupsResponse
```typescript
interface GroupsResponse {
  data: Group[];
  pagination: Pagination;
}
```

### CreateGroupRequest
```typescript
interface CreateGroupRequest {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  parentId?: string | null;
  enableGroupshelf?: boolean;
}
```

### UpdateGroupRequest
```typescript
interface UpdateGroupRequest {
  name?: string;
  description?: string;
  icon?: string;
  category?: string;
  parentId?: string | null;
  enableGroupshelf?: boolean;
}
```

---

## Channel Types

### Channel
```typescript
interface Channel {
  id: string;
  name: string;
  channelId: string;
  url: string;
  thumbnail?: string;
  contentType?: string;
  subscriberCount?: number;
  videoCount?: number;
  groupId: string;
  groupName?: string;
  groupIcon?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### ChannelsResponse
```typescript
interface ChannelsResponse {
  data: Channel[];
  pagination: Pagination;
}
```

### CreateChannelRequest
```typescript
interface CreateChannelRequest {
  name: string;
  channelId: string;
  url: string;
  thumbnail?: string;
  subscriberCount?: number;
  videoCount?: number;
  groupId: string;
}
```

### UpdateChannelRequest
```typescript
interface UpdateChannelRequest {
  id: string;
  contentType?: string;
  name?: string;
  channelId?: string;
  url?: string;
  thumbnail?: string;
  subscriberCount?: number;
  videoCount?: number;
  groupId?: string;
}
```

### BatchUpdateChannelRequest
```typescript
interface BatchUpdateChannelRequest {
  channels: UpdateChannelRequest[];
}
```

---

## Anime Types

### Anime
```typescript
interface Anime {
  id: string;
  userId?: string | null;
  groupId?: string | null;
  name: string;
  channelId: string;
  thumbnail?: string;
  createdAt?: string;
  contentType?: string;
  updatedAt?: string;
  groupName?: string;
  groupIcon?: string;
  url?: string;
}
```

### PaginatedAnimesResponse
```typescript
interface PaginatedAnimesResponse {
  data: Anime[];
  pagination: Pagination;
}
```

---

## Website Types

### Website
```typescript
interface Website {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  groupId: string;
  groupName?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### WebsitesResponse
```typescript
interface WebsitesResponse {
  data: Website[];
  pagination: Pagination;
}
```

---

## Share Link Types

### ShareLink
```typescript
interface ShareLink {
  id: string;
  groupId: string;
  group_id: string;
  linkCode: string;
  linkType: string;
  permission?: string;
  createdAt?: string;
  expiresAt?: string;
}
```

### ConsumedShareLinkResponse
```typescript
interface ConsumedShareLinkResponse {
  groupId: string;
  groupName: string;
  groupDescription: string | null;
  linkType: string;
  permission: string | null;
  channelCount: number;
  channels: Channel[];
}
```

### ShareLinksResponse
```typescript
interface ShareLinksResponse {
  data: ShareLink[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### GenerateShareLinkVariables
```typescript
interface GenerateShareLinkVariables {
  id: string;
  linkType: string;
  permission: string;
}
```

### GenerateShareLinkResponseData
```typescript
interface GenerateShareLinkResponseData {
  shareLink: string;
}
```

---

## Group Shelf Types

### GroupShelf
```typescript
interface GroupShelf {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  userId: string;
  createdAt: string;
}
```

### GroupShelfResponse
```typescript
interface GroupShelfResponse {
  data: GroupShelf[];
  pagination: Pagination;
}
```

---

## Blog Types

### BlogPost
```typescript
interface BlogPost {
  id: number;
  status: string;
  sort: number | null;
  date_created: string;
  date_updated: string;
  image: string;
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  featured: boolean;
  content: string;
  author?: string;
}
```

### BlogPostsResponse
```typescript
interface BlogPostsResponse {
  data: BlogPost[];
  total: number;
}
```

### SingleBlogPostsResponse
```typescript
interface SingleBlogPostsResponse {
  data: BlogPost;
  total: number;
}
```

### BlogQueryParams
```typescript
interface BlogQueryParams {
  status?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  slug?: string;
}
```

---

## Video Types

### Video
```typescript
interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  channelId: string;
  channelName?: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  likeCount?: number;
}
```

### GroupVideosResponse
```typescript
interface GroupVideosResponse {
  data: Video[];
  pagination: Pagination;
}
```

---

## Dashboard Types

### DashboardTotalResponse
```typescript
type DashboardTotalResponse = {
  groups: number;
  channels: number;
  youtubeChannels: number;
  sharedGroups: number;
  animeChannels: number;
};
```

---

## Payment Types

### CreateCheckoutSessionRequest
```typescript
interface CreateCheckoutSessionRequest {
  priceId: string;
  interval: 'monthly' | 'yearly';
}
```

### CheckoutSessionResponse
```typescript
interface CheckoutSessionResponse = {
  url: string;
};
```

---

## User Mutation Types

### UpdateProfileRequest
```typescript
type UpdateProfileRequest = {
  name?: string;
  email?: string;
};
```

### UpdateProfileResponse
```typescript
type UpdateProfileResponse = {
  success: boolean;
  user?: User;
};
```

---

## Social Login Types

### SocialLoginSessionStatus
```typescript
interface SocialLoginSessionStatus {
  status: 'pending' | 'completed' | 'failed';
  user?: User;
  token?: string;
}
```

---

## API Endpoints Summary

### Authentication
- `POST /authorize` - Login
- `POST /registration` - Register
- `POST /forget-password` - Forgot password
- `POST /auth/update_password` - Update password
- `DELETE /account` - Delete account

### User
- `GET /api/v3/me` - Get current user
- `POST /logout` - Logout

### Groups
- `GET /api/v3/groups` - List groups (paginated)
- `GET /api/v2/groups/:id` - Get single group
- `POST /api/v2/groups` - Create group
- `PUT /api/v2/groups/:id` - Update group
- `DELETE /api/v2/groups/:id` - Delete group
- `PUT /api/v2/groups/:id/display-order` - Update display order
- `PUT /api/v2/groups/display-order/bulk` - Bulk update display order
- `POST /api/v3/groups/:id/videos/sync` - Sync videos

### Channels
- `GET /api/v2/channels` - List all channels (paginated)
- `GET /api/v2/channels/:id` - Get single channel
- `GET /api/v2/channels/group/:groupId` - Get channels by group
- `POST /api/v2/channels` - Create channel
- `PATCH /api/v2/channels/:id` - Update channel
- `DELETE /api/v2/channels/:id` - Delete channel
- `POST /api/v3/channels/:groupId/batch` - Batch update channels
- `POST /api/v3/proxy/fetch-url` - Fetch channel from URL

### Animes
- `GET /api/v3/animes` - List animes (paginated)

### Websites
- `GET /api/v3/websites` - List websites (paginated)

### Share Links
- `GET /api/v3/share-links` - List share links
- `POST /api/v3/share-links` - Create share link
- `DELETE /api/v3/share-links/:id` - Delete share link
- `GET /api/v2/share-link/:id` - Get share link
- `POST /api/v2/share-link` - Generate share link
- `POST /api/v2/share-link/:linkType/:linkCode` - Consume share link

### Group Shelf
- `GET /groupshelf` - Get group shelf
- `POST /groupshelf` - Copy group shelf

### Blog
- `GET /api/v3/blog` - List blog posts
- `GET /api/v3/blog/:slug` - Get single blog post

### Dashboard
- `GET /api/v2/dashboard/total` - Get dashboard totals

### Payments
- `POST /api/v3/payments/checkout` - Create checkout session
- `POST /api/v3/payments/cancel` - Cancel subscription

---

## Usage in React Native

### API Client Setup
```typescript
// api/client.ts
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = "https://your-api.com") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  async post<T>(endpoint: string, data?: unknown): Promise<T>
  async put<T>(endpoint: string, data?: unknown): Promise<T>
  async patch<T>(endpoint: string, data?: unknown): Promise<T>
  async delete<T>(endpoint: string): Promise<T>

  setAuthToken(token: string)
  removeAuthToken()
}

export const apiClient = new ApiClient();
```

### React Query Setup
```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  );
}
```

### Hook Example
```typescript
// hooks/useGroups.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/api/client';
import type { Group, GroupsResponse } from '@/types';

export function useGroups(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['groups', params],
    queryFn: () => apiClient.get<GroupsResponse>('api/v3/groups', params),
  });
}
```